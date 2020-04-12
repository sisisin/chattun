import { TweetActions } from 'app/features/tweetList/interface';
import { slackClient } from 'app/services/http/SlackClient';
import React from 'react';
import { OperatorFunction } from 'rxjs';
import * as Rx from 'typeless/rx';
import { getGlobalSettingState } from '../globalSetting/interface';
import { getMarkedByChannels, isAfterMarked } from '../slack/SlackQuery';
import { TimelineView } from './components/TimelineView';
import { handle, TimelineActions, TimelineState } from './interface';

const withInterval: <T>(period: number) => OperatorFunction<T, T> = period =>
  Rx.concatMap(val => Rx.interval(period).pipe(Rx.take(1), Rx.mapTo(val)));

// --- Epic ---
handle.epic().onMany([TimelineActions.$mounted, TimelineActions.$remounted], (_, { action$ }) =>
  action$.pipe(
    Rx.filter(() => getGlobalSettingState().markAsRead),
    Rx.ofType(TweetActions.tweetIntersected),
    Rx.takeUntil(action$.pipe(Rx.ofType(TimelineActions.$unmounting))),
    Rx.map(({ payload: { message } }) => message),
    Rx.groupBy(msg => msg.channelId), // 既読はchannel毎に管理されるので、まずchannel毎のstreamに分解

    // channel毎に2secバッファリングして最新のtsだけmark対象として次に流す
    // 連投からのrate limit対策
    Rx.mergeMap(byChannel$ =>
      byChannel$.pipe(
        Rx.bufferTime(2000),
        Rx.filter(msgs => msgs.length > 0), // bufferは値が来なかったら空配列送りつけてくるので
        Rx.map(msgs => {
          const sorted = msgs.sort((a, b) => (a.ts < b.ts ? -1 : 1))[msgs.length - 1];
          return sorted;
        }),
        Rx.filter(msg => isAfterMarked(msg, getMarkedByChannels())),
      ),
    ),
    withInterval(1000), // mergeMapされたstreamはほぼインターバルなしで流れてくるので1secずつ間をもたせる
    Rx.mergeMap(async msg => {
      try {
        await slackClient.mark(msg.channelId, msg.ts);
        return TimelineActions.markFulfilled(msg);
      } catch {
        return null;
      }
    }),
  ),
);

// --- Reducer ---
const initialState: TimelineState = {};

export const reducer = handle.reducer(initialState);

// --- Module ---
export const TimelineModule = () => {
  handle();
  return <TimelineView />;
};
