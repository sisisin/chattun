import { getSlackState, Message, SlackState } from 'app/features/slack/interface';
import { SlackEntity } from 'app/types/slack';
import { assertNever } from 'app/types/typeAssertions';
import { createSelector } from 'typeless';
import { GlobalSettingState } from '../globalSetting/interface';
import {
  type CustomEmojiInfo,
  type FileAttachment,
  type ImageAttachment,
  Reaction,
  Tweet,
} from '../timeline/interface';
import { getChannelName, getMessageProfile } from '../timeline/TimelineQuery';

function getReactions(
  reactions: SlackEntity.Message.Reaction[] | undefined,
  { users, emojis, profile: { userId } }: Pick<SlackState, 'users' | 'emojis' | 'profile'>,
) {
  const res: Reaction[] = [];
  reactions?.forEach(r => {
    const reacted = r.users.findIndex(u => u === userId) !== -1;
    const reactors =
      users === undefined
        ? []
        : r.users.map(user => {
            if (user === userId) {
              return 'You';
            } else {
              return users[user]?.name ?? user;
            }
          });
    const emojiUrl = emojis[r.name];
    const emoji =
      emojiUrl !== undefined && !emojiUrl.startsWith('alias:')
        ? convertEmoji(r.name, emojiUrl)
        : undefined;
    res.push({
      name: r.name,
      emoji,
      count: r.count,
      reactors,
      reacted,
    });
  });
  return res;
}
export function slackMessageToTweet(
  msg: Message,
  {
    users,
    channels,
    emojis,
    profile,
  }: Pick<SlackState, 'channels' | 'users' | 'emojis' | 'profile'>,
  deepLinking: GlobalSettingState['deepLinking'],
): Tweet {
  const reactions = getReactions(msg.reactions, { users, emojis, profile });
  const channelName = getChannelName(channels, users, msg);

  const { displayName, fullName, iconUrl } = getMessageProfile(users, msg);

  const text = getMessageText(msg);
  const files = getFileAttachments(msg);
  const imageAttachments = getImageAttachments(msg);

  return {
    threadTs: msg.thread_ts,
    channelId: msg.channel,
    ts: msg.ts,
    channelName,
    channelLink: getChannelLink(profile, msg, deepLinking),
    displayName,
    fullName,
    iconUrl,
    reactions,
    text,
    files,
    imageAttachments,
    slackLink: getSlackLink(profile, msg, deepLinking),
    edited: msg.edited,
    updatedAt: msg.updatedAt,
  };
}

function getSlackLink(
  profile: SlackState['profile'],
  msg: Message,
  deepLinking: GlobalSettingState['deepLinking'],
): Tweet['slackLink'] {
  const base = { type: deepLinking };
  const channelId = msg.channel!;
  const ts = msg.ts;
  const timestamp = 'p' + ts.replace('.', '');

  switch (deepLinking) {
    case 'viaBrowser':
      return {
        ...base,
        link:
          profile.domain === undefined
            ? undefined
            : `https://${profile.domain}.slack.com/archives/${channelId}/${timestamp}${
                msg.thread_ts ? `?thread_ts=${msg.thread_ts}&cid=${channelId}` : ''
              }`,
      };
    case 'directly':
      return {
        ...base,
        link: `slack://channel?team=${msg.team}&id=${channelId}&message=${ts}${
          msg.thread_ts ? `&thread_ts=${msg.thread_ts}` : ''
        }`,
      };
    default:
      assertNever(deepLinking);
  }
}

function getChannelLink(
  profile: SlackState['profile'],
  msg: Message,
  deepLinking: GlobalSettingState['deepLinking'],
): Tweet['channelLink'] {
  const base = { type: deepLinking };
  const channelId = msg.channel!;

  switch (deepLinking) {
    case 'viaBrowser':
      return {
        ...base,
        link:
          profile.domain === undefined
            ? undefined
            : `https://${profile.domain}.slack.com/archives/${channelId}`,
      };
    case 'directly':
      return {
        ...base,
        link:
          msg.team === undefined ? undefined : `slack://channel?team=${msg.team}&id=${channelId}`,
      };
    default:
      assertNever(deepLinking);
  }
}

const imgFileRegexp = /(png|jpg|jpeg|gif)/;
function getMessageText(msg: Message): string {
  // For message_changed with image attachments, use fallback text
  if (msg.subtype === 'message_changed' && msg.message && Array.isArray(msg.message.attachments)) {
    const hasImage = msg.message.attachments.some(a => a.image_url);
    if (hasImage) {
      return msg.text ?? '';
    }
  }
  return msg.text ?? '';
}

function getFileAttachments(msg: Message): FileAttachment[] {
  if (!msg.files) return [];
  return msg.files
    .filter(({ filetype }) => imgFileRegexp.test(filetype))
    .map(({ thumb_360, url_private }) => ({
      thumb360: thumb_360,
      urlPrivate: url_private,
    }));
}

function getImageAttachments(msg: Message): ImageAttachment[] {
  if (msg.subtype !== 'message_changed' || !msg.message?.attachments) return [];
  return msg.message.attachments
    .filter(a => a.image_url)
    .map(a => ({
      fallback: a.fallback ?? '',
      imageUrl: a.image_url!,
    }));
}

export function convertEmoji(name: string, imageUrl: string): CustomEmojiInfo {
  return {
    id: name,
    name,
    keywords: [name],
    skins: [{ src: imageUrl }],
  };
}

export function toSlackMessages(
  messagesByChannel: SlackState['messagesByChannel'],
  sort: 'asc' | 'desc',
) {
  const msgs: Message[] = [];
  for (const byChannel of Object.values(messagesByChannel)) {
    for (const msg of Object.values(byChannel!)) {
      msgs.push(msg);
    }
  }

  return msgs.sort((a, b) => {
    if (sort === 'asc') {
      return a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0;
    } else if (sort === 'desc') {
      return a.ts > b.ts ? -1 : a.ts < b.ts ? 1 : 0;
    } else {
      return assertNever(sort);
    }
  });
}

export const getMarkedByChannels = createSelector([getSlackState, s => s.markedByChannels], m => m);
export const isAfterMarked = (
  message: { channelId: string; ts: string },
  markedByChannels: SlackState['markedByChannels'],
) => {
  return (
    markedByChannels[message.channelId] === undefined ||
    markedByChannels[message.channelId] < message.ts
  );
};

export const getMartEmojis = createSelector([getSlackState, s => s.emojis], emojis => {
  const customEmojis = Object.entries(emojis as Record<string, string>)
    .filter(([, value]) => !value.startsWith('alias:'))
    .map(([key, value]) => convertEmoji(key, value));
  return [{ id: 'custom', name: 'Custom', emojis: customEmojis }];
});
