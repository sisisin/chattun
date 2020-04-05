import React from 'react';
import { getSlackState } from 'app/features/slack/interface';
import { handle, TweetActions } from './interface';
import { TweetListView } from './components/TweetList';
import { Tweet } from '../timeline/interface';

handle.epic().on(TweetActions.copyClicked, ({ msg }) => {
  const { messagesByChannel } = getSlackState();
  if (navigator.clipboard) {
    const row = messagesByChannel[msg.channelId]?.[msg.ts];
    navigator.clipboard.writeText(JSON.stringify({ row, proced: msg }));
  }

  return null;
});

interface Props {
  messages: Tweet[];
}
export const TweetListModule: React.FC<Props> = p => {
  handle();
  return <TweetListView {...p}></TweetListView>;
};
