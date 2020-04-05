import { createSelector } from 'typeless';
import { getSlackState } from '../slack/interface';
import { getThreadState } from './interface';
import { toSlackMessages, slackMessageToTweet } from '../slack/SlackQuery';

export const getThreadMessages = createSelector(
  [getSlackState, slack => slack],
  [getThreadState, thread => thread],
  (slack, { ts, channelId }) => {
    return toSlackMessages(slack.messagesByChannel, 'asc')
      .filter(msg => (msg.ts === ts || msg.thread_ts === ts) && msg.channel === channelId)
      .map(msg => slackMessageToTweet(msg, slack));
  },
);
