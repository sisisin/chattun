import { createSelector } from 'typeless';
import { getSlackState } from '../slack/interface';
import { getThreadState } from './interface';
import { toSlackMessages, slackMessageToTweet } from '../slack/selector';
import { getGlobalSettingState } from '../globalSetting/interface';
import { filterMutedUsers } from '../timeline/selector';

export const getThreadMessages = createSelector(
  [getSlackState, slack => slack],
  [getThreadState, thread => thread],
  [getGlobalSettingState, s => s.deepLinking],
  [getGlobalSettingState, s => s.mutedUsers],
  (slack, { ts, channelId }, deepLinking, mutedUsers) => {
    const tweets = toSlackMessages(slack.messagesByChannel, 'asc')
      .filter(msg => (msg.ts === ts || msg.thread_ts === ts) && msg.channel === channelId)
      .map(msg => slackMessageToTweet(msg, slack, deepLinking));
    return filterMutedUsers(tweets, mutedUsers);
  },
);
