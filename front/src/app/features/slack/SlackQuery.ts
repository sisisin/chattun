import { getSlackState, Message, SlackState } from 'app/features/slack/interface';
import { assertNever } from 'app/types/typeAssertions';
import { CustomEmoji } from 'emoji-mart';
import { createSelector } from 'typeless';
import { Tweet, Reaction } from '../timeline/interface';
import { getChannelName, getMessageProfile, textToHtml } from '../timeline/TimelineQuery';
import { SlackEntity } from 'app/types/slack';

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
    const emoji = emojis[r.name];
    res.push({
      name: r.name,
      emoji: emoji !== undefined ? convertEmoji(r.name, emoji) : undefined,
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
): Tweet {
  const reactions = getReactions(msg.reactions, { users, emojis, profile });
  const channelName = getChannelName(channels, users, msg);

  const { displayName, fullName, iconUrl } = getMessageProfile(users, msg);

  // todo: botなどのattachmentが全然対応できてない
  const text = textToHtml(msg, users, emojis);

  const channelId = msg.channel!;
  const ts = msg.ts;
  const timestamp = 'p' + ts.replace('.', '');

  return {
    threadTs: msg.thread_ts,
    channelId: msg.channel,
    ts,
    channelName,
    displayName,
    fullName,
    iconUrl,
    reactions,
    text,
    deepLink: {
      web:
        `https://${profile.domain}.slack.com/archives/${channelId}/${timestamp}` +
        (msg.thread_ts ? `?thread_ts=${msg.thread_ts}&cid=${channelId}` : ''),
      slack:
        `slack://channel?team=${msg.user_team || msg.team}&id=${channelId}&message=${ts}` +
        (msg.thread_ts ? `&thread_ts=${msg.thread_ts}` : ''),
    },
    edited: msg.edited,
    updatedAt: msg.updatedAt,
  };
}

export function convertEmoji(name: string, imageUrl: string): CustomEmoji {
  return {
    name,
    short_names: [name],
    emoticons: [],
    keywords: [name],
    imageUrl,
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
  return Object.entries(emojis as Record<string, string>)
    .map(([key, value]) => convertEmoji(key, value))
    .filter(elem => !elem.imageUrl.startsWith('alias:'));
});
