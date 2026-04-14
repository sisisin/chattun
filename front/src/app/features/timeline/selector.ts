import { getSlackState, SlackState, Message } from 'app/features/slack/interface';
import { SlackEntity } from 'app/types/slack';
import { ChannelMatch } from 'app/types/TimelineSettings';
import { assertNever } from 'app/types/typeAssertions';
import { createSelector } from 'typeless';
import { getGlobalSettingState } from '../globalSetting/interface';
import { slackMessageToTweet, toSlackMessages } from '../slack/selector';

export function getChannelName(
  channelMap: SlackState['channels'],
  userMap: Partial<Record<string, SlackEntity.Member>>,
  msg: Message,
): string {
  const channel = channelMap[msg.channel];
  if (channel === undefined) {
    return `#${msg.channel}`;
  } else if (channel.is_im) {
    return `@${getProfile(userMap, channel.user).displayName}`;
  } else {
    return `#${channel.name}`;
  }
}

export const getMessageProfile = (map: SlackState['users'], msg: Message) => {
  const member = msg.user ? map[msg.user] : undefined;
  if (!member) {
    const name = msg.user ?? msg.username ?? msg.bot_profile?.name ?? '';
    const iconUrl =
      msg.icons?.image_48 ||
      msg.bot_profile?.icons?.image_48 ||
      msg.bot_profile?.icons?.image_72 ||
      '';
    return { displayName: name, fullName: name, iconUrl };
  }
  return {
    displayName: member.profile.display_name || member.real_name,
    fullName: member.real_name,
    iconUrl: member.profile.image_48,
  };
};

export const getProfile = (map: SlackState['users'], userId: string) => {
  const member = map[userId];
  if (!member) {
    return { displayName: userId, fullName: userId, iconUrl: '' };
  }
  return {
    displayName: member.profile.display_name || member.real_name,
    fullName: member.real_name,
    iconUrl: member.profile.image_48,
  };
};

function filterMessages(
  { channels, messagesByChannel }: Pick<SlackState, 'channels' | 'messagesByChannel'>,
  channelMatches: ChannelMatch[],
) {
  const match = getChannelNameMatcher();

  const t = Object.values(channels as Record<string, SlackEntity.Conversation>)
    .filter(c => {
      // note: im is not supported
      if (c.is_im) {
        return false;
      }
      if (c.is_member === false) {
        return false;
      }

      return match(c.name);
    })
    .map(c => c.id);

  const targetChannels = new Set(t);

  return toSlackMessages(messagesByChannel, 'desc').filter(m =>
    targetChannels.has(m.channel ?? ''),
  );

  function matchSingle(channelName: string, { matchMethod, matchValue }: ChannelMatch): boolean {
    switch (matchMethod) {
      case 'contain':
        return channelName.indexOf(matchValue) > -1;
      case 'startsWith':
        return channelName.startsWith(matchValue);
      case 'endsWith':
        return channelName.endsWith(matchValue);
      default:
        return assertNever(matchMethod);
    }
  }

  function getChannelNameMatcher() {
    const activeMatches = channelMatches.filter(m => m.matchValue !== '');
    if (activeMatches.length === 0) {
      return (_channelName: string) => true;
    }
    return (channelName: string) => activeMatches.some(m => matchSingle(channelName, m));
  }
}

const getFilteredMessages = createSelector(
  [getSlackState, slack => slack.channels],
  [getSlackState, slack => slack.messagesByChannel],
  [getGlobalSettingState, ({ channelMatches }) => channelMatches],
  (channels, messagesByChannel, channelMatches) =>
    filterMessages({ channels, messagesByChannel }, channelMatches),
);

export const getTimelineMessages = createSelector(
  getFilteredMessages,
  [getSlackState, slack => slack.channels],
  [getSlackState, slack => slack.users],
  [getSlackState, slack => slack.emojis],
  [getSlackState, slack => slack.profile],
  [getGlobalSettingState, s => s.deepLinking],
  [getGlobalSettingState, s => s.mutedUsers],
  (filtered, channels, users, emojis, profile, deepLinking, mutedUsers) => {
    const tweets = filtered.map(msg =>
      slackMessageToTweet(msg, { channels, emojis, users, profile }, deepLinking),
    );
    return filterMutedUsers(tweets, mutedUsers);
  },
);

export function filterMutedUsers<T extends { displayName: string; fullName: string }>(
  messages: T[],
  mutedUsers: string[],
): T[] {
  if (mutedUsers.length === 0) return messages;
  return messages.filter(
    msg =>
      !mutedUsers.some(
        muted => muted !== '' && (msg.displayName.includes(muted) || msg.fullName.includes(muted)),
      ),
  );
}
