import { getSlackState, SlackState, Message } from 'app/features/slack/interface';
import { SlackEntity } from 'app/types/slack';
import { ChannelMatch } from 'app/types/TimelineSettings';
import { assertNever } from 'app/types/typeAssertions';
import * as MI from 'markdown-it';
import { emojify } from 'node-emoji';
import { createSelector } from 'typeless';
import { getGlobalSettingState } from '../globalSetting/interface';
import { slackMessageToTweet, toSlackMessages } from '../slack/SlackQuery';
import { basePath } from 'app/config';

function getMditInstance() {
  const md =
    process.env.NODE_ENV === 'test'
      ? (MI as any).default({ html: true, breaks: true })
      : (MI as any)({
          html: true,
          breaks: true,
        });

  // add _blank attribute to anchor tag
  // ref. https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
  const defaultRender =
    md.renderer.rules.link_open ||
    ((tokens: any, idx: any, options: any, env: any, self: any) => {
      return self.renderToken(tokens, idx, options);
    });

  md.renderer.rules.link_open = (tokens: any, idx: any, options: any, env: any, self: any) => {
    // If you are sure other plugins can't add `target` - drop check below
    const aIndex = tokens[idx].attrIndex('target');

    if (aIndex < 0) {
      tokens[idx].attrPush(['target', '_blank']); // add new attribute
    } else {
      tokens[idx].attrs[aIndex][1] = '_blank'; // replace value of existing attr
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };
  return md;
}

const mdit = getMditInstance();

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
  const member = map[msg.user!];
  if (!member) {
    const name = msg.user ?? msg.username ?? '';
    if (msg.icons) {
      const iconUrl = msg.icons.image_48 || '';
      return { displayName: name, fullName: name, iconUrl };
    } else {
      return { displayName: name, fullName: name, iconUrl: '' };
    }
  }
  return {
    displayName: member.name,
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
    displayName: member.name,
    fullName: member.real_name,
    iconUrl: member.profile.image_48,
  };
};

const imgFileRegexp = /(png|jpg|jpeg|gif)/;
export const fileToText = (fileMessageRow: Message) => {
  if (!fileMessageRow.files) {
    return undefined;
  }
  return fileMessageRow.files
    .filter(({ filetype }) => imgFileRegexp.test(filetype))
    .map(({ thumb_360, url_private }) => {
      const u = new URL('/file', basePath);
      u.searchParams.append('target_url', thumb_360);
      return `
      <a href="${url_private}" target="_blank" rel="noopener">
        <img class="tweet-contents-image" src="${u}" />
      </a>
`;
    })
    .join('<br>');
};

const userMention = /<@(.*?)>/g;
const groupMention = /<!(channel|here)>/g;
const userGroupMention = /<!subteam\^\w+\|@(\w+?)>/g;
const channelName = /<#\w+\|(\w+)>/g;
export const toMention = (message: Message, membersMap: SlackState['users']) => {
  const rowText = message.text ? message.text : '';
  return rowText
    .replace(userMention, (match, $1: string) => `@${getProfile(membersMap, $1).displayName}`)
    .replace(groupMention, (match, $1: string) => `@${$1}`)
    .replace(userGroupMention, (match, $1: string) => `@${$1}`)
    .replace(channelName, (match, $1: string) => `#${$1}`);
};

const imageAttachmentToText = (attachment: SlackEntity.Attachment) => {
  return `<img alt="${attachment.fallback}" src="${attachment.image_url}" />`;
};

export const textWithAttachmentToText = (msg: Message, userReplacedMessage: string) => {
  if (msg.subtype === 'message_changed' && msg.message && Array.isArray(msg.message.attachments)) {
    return msg.message.attachments
      .map(a => {
        if (a.image_url) {
          return imageAttachmentToText(a);
        } else {
          // todo
          return userReplacedMessage;
        }
      })
      .join('<br>');
  } else {
    return userReplacedMessage;
  }
};

const emojiRegex = /:(.+?):/g;
export const textToEmojified = (text: string, emojis: SlackState['emojis']): string => {
  const basicEmojified = emojify(text);
  return basicEmojified.replace(emojiRegex, (match, $1: string) => {
    const imageUrl = emojis[$1];
    if (imageUrl) {
      if (imageUrl.startsWith('alias:')) {
        const res = textToEmojified(`:${imageUrl.slice(6)}:`, emojis);
        return res.startsWith(':') ? match : res;
      } else {
        return `<img class="tweet-contents-slack-emoji" src="${imageUrl}" alt="${$1}">`;
      }
    } else {
      return match;
    }
  });
};

export const textToMd = (text: string) => {
  return mdit.render(text);
};

export const textToHtml = (
  message: Message,
  memberMap: SlackState['users'],
  emojis: SlackState['emojis'],
) => {
  const fromFile = fileToText(message);

  const userReplacedMessage = toMention(message, memberMap);
  // fixme: image以外が死ぬ
  const imageAttachedText = textWithAttachmentToText(message, userReplacedMessage);
  const emojifiedText = textToEmojified(imageAttachedText, emojis);
  const mdfied = textToMd(emojifiedText);

  if (fromFile) {
    return `${mdfied}
<br>
${fromFile}`;
  } else {
    return mdfied;
  }
};

export const getTimelineMessages = createSelector(
  [getSlackState, slack => slack.messagesByChannel],
  [getSlackState, slack => slack.channels],
  [getSlackState, slack => slack.users],
  [getSlackState, slack => slack.emojis],
  [getSlackState, slack => slack.profile],
  [getGlobalSettingState, s => s.deepLinking],
  [getGlobalSettingState, ({ timelines }) => timelines],
  (messagesByChannel, channels, users, emojis, profile, deepLinking, timelineSettings) => {
    return timelineSettings.map(tl => {
      const filtered = filterMessages({ channels, messagesByChannel }, tl.channelMatch);
      return filtered
        .map(msg => slackMessageToTweet(msg, { channels, emojis, users, profile }, deepLinking))
        .filter(m => {
          if (tl.keywordMatch?.matchMethod === 'notContain' && tl.keywordMatch?.matchValue !== '') {
            return (
              !m.displayName.includes(tl.keywordMatch?.matchValue) &&
              !m.fullName.includes(tl.keywordMatch?.matchValue) &&
              !m.text.includes(tl.keywordMatch?.matchValue)
            );
          }
          return true;
        });
    });
  },
);

function filterMessages(
  { channels, messagesByChannel }: Pick<SlackState, 'channels' | 'messagesByChannel'>,
  channelMatch: ChannelMatch | undefined,
) {
  if (channelMatch === undefined || channelMatch.matchValue === '') {
    return toSlackMessages(messagesByChannel, 'desc');
  }
  const { matchValue, matchMethod } = channelMatch;

  const t = Object.values(channels as Record<string, SlackEntity.Conversation>)
    .filter(c => {
      // note: im is not supported
      if (c.is_im) {
        return false;
      }

      const channelName = c.name;
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
    })
    .map(c => c.id);

  const targetChannels = new Set(t);

  return toSlackMessages(messagesByChannel, 'desc').filter(m =>
    targetChannels.has(m.channel ?? ''),
  );
}
