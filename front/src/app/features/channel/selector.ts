import { createSelector } from 'typeless';
import { getSlackState } from '../slack/interface';
import { getChannelState } from './interface';
import { slackMessageToTweet, toSlackMessages } from '../slack/selector';
import { getGlobalSettingState } from '../globalSetting/interface';
import { filterMutedUsers } from '../timeline/selector';

export const getChannelMessages = createSelector(
  [getSlackState, slack => slack],
  [getChannelState, channel => channel.channelId],
  [getGlobalSettingState, s => s.deepLinking],
  [getGlobalSettingState, s => s.mutedUsers],
  (slack, channelId, deepLinking, mutedUsers) => {
    if (!channelId) return [];
    const tweets = toSlackMessages(slack.messagesByChannel, 'desc')
      .filter(msg => msg.channel === channelId)
      .map(msg => slackMessageToTweet(msg, slack, deepLinking));
    return filterMutedUsers(tweets, mutedUsers);
  },
);

export const getChannelDisplayName = createSelector(
  [getSlackState, slack => slack.channels],
  [getChannelState, channel => channel.channelId],
  (channels, channelId) => {
    if (!channelId) return '';
    const channel = channels[channelId];
    return channel ? `#${channel.name}` : `#${channelId}`;
  },
);
