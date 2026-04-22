import { getSlackState, Message, SlackState } from 'app/features/slack/interface';
import { BlockKit, SlackEntity } from 'app/types/slack';
import { assertNever } from 'app/types/typeAssertions';
import { createSelector } from 'typeless';
import { GlobalSettingState } from '../globalSetting/interface';
import {
  type CustomEmojiInfo,
  type FileAttachment,
  type ImageAttachment,
  type TextAttachment,
  Reaction,
  Tweet,
} from '../timeline/interface';
import { getChannelName, getMessageProfile } from '../timeline/selector';

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
              const member = users[user];
              return member ? member.profile.display_name || member.real_name : user;
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

  const text = msg.text ?? '';
  const files = getFileAttachments(msg);
  const imageAttachments = getImageAttachments(msg);
  const textAttachments = getTextAttachments(msg);

  return {
    threadTs: msg.thread_ts,
    channelId: msg.channel,
    ts: msg.ts,
    channelName,
    displayName,
    fullName,
    iconUrl,
    reactions,
    text,
    files,
    imageAttachments,
    textAttachments,
    slackLink: getSlackLink(profile, msg, deepLinking),
    edited: msg.edited,
    isHuddle: msg.room?.call_family === 'huddle',
    blocks: msg.blocks?.filter((b): b is BlockKit.RichTextBlock => b.type === 'rich_text'),
    updatedAt: msg.updatedAt,
  };
}

function getTeamId(msg: Message, profile: SlackState['profile']): string | undefined {
  return msg.team ?? msg.files?.[0]?.user_team ?? profile.teamId;
}

function getSlackLink(
  profile: SlackState['profile'],
  msg: Message,
  deepLinking: GlobalSettingState['deepLinking'],
): Tweet['slackLink'] {
  const base = { type: deepLinking };

  // ハドルメッセージは permalink を優先（常に HTTPS URL なので viaBrowser 固定）
  if (msg.permalink) {
    return { type: 'viaBrowser', link: msg.permalink };
  }

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
    case 'directly': {
      const teamId = getTeamId(msg, profile);
      return {
        ...base,
        link:
          teamId === undefined
            ? undefined
            : `slack://channel?team=${teamId}&id=${channelId}&message=${ts}${
                msg.thread_ts ? `&thread_ts=${msg.thread_ts}` : ''
              }`,
      };
    }
    default:
      assertNever(deepLinking);
  }
}

const imgFileRegexp = /(png|jpg|jpeg|gif)/;

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
  if (!msg.message?.attachments) return [];
  return msg.message.attachments
    .filter(a => a.image_url)
    .map(a => ({
      fallback: a.fallback,
      imageUrl: a.image_url!,
    }));
}

function getAttachmentFiles(files: NonNullable<SlackEntity.Attachment['files']>): FileAttachment[] {
  return files
    .filter(({ filetype }) => imgFileRegexp.test(filetype))
    .map(({ thumb_360, url_private }) => ({
      thumb360: thumb_360,
      urlPrivate: url_private,
    }));
}

function getTextAttachments(msg: Message): TextAttachment[] {
  if (!msg.attachments) return [];
  return msg.attachments
    .filter(a => a.text || a.pretext || a.title || (a.files && a.files.length > 0))
    .map(a => ({
      text: a.text,
      pretext: a.pretext,
      title: a.title,
      titleLink: a.title_link,
      authorName: a.author_name,
      authorIcon: a.author_icon,
      footer: a.footer,
      color: a.color,
      imageUrl: a.image_url,
      files: a.files ? getAttachmentFiles(a.files) : undefined,
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
