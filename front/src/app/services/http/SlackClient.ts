import { SlackAPI } from 'app/types/slack/SlackAPI';
import { auth, channels, conversations, emoji, reactions, users } from 'slack';
import { EitherFactory } from '../EitherContainer';
import { SlackEntity } from 'app/types/slack';

let slackClient: SlackClient | null = null;
export function instantiateSlackClient(token: string) {
  slackClient = new SlackClient(token);
}
export function getSlackClient() {
  if (!slackClient) {
    throw new Error('slack client is not instantiated');
  }
  return slackClient;
}
class SlackClient {
  constructor(private token: string) {}
  authTest() {
    return auth.test({ token: this.token }).then(
      res => EitherFactory.createRight(res),
      err => EitherFactory.createLeft(err),
    );
  }

  listEmojis(): Promise<SlackAPI.Emoji.List> {
    return emoji.list({ token: this.token }) as Promise<SlackAPI.Emoji.List>;
  }

  listUsers(): Promise<SlackAPI.Users.List> {
    const baseParam = { token: this.token, limit: 200 };
    function rec(
      members: SlackEntity.Member[],
      cursor: string | undefined,
    ): Promise<SlackAPI.Users.List> {
      const param = cursor ? { ...baseParam, cursor } : baseParam;
      return (users.list(param) as Promise<SlackAPI.Users.List>).then(res => {
        const concatinatedMembers = members.concat(res.members);
        if (res.response_metadata && res.response_metadata.next_cursor) {
          return rec(concatinatedMembers, res.response_metadata.next_cursor);
        } else {
          return { ...res, members: concatinatedMembers };
        }
      });
    }
    return rec([], undefined);
  }
  listChannels(): Promise<SlackAPI.Conversations.List> {
    const baseParam = {
      token: this.token,
      types: 'public_channel,private_channel,im,mpim',
      exclude_archived: true,
      limit: 200,
    };
    function rec(
      channels: SlackEntity.Conversation[],
      cursor: string | undefined,
    ): Promise<SlackAPI.Conversations.List> {
      const param = cursor ? { ...baseParam, cursor } : baseParam;
      return (conversations.list(param) as Promise<SlackAPI.Conversations.List>).then(res => {
        const concatinatedChannels = channels.concat(res.channels);
        if (res.response_metadata && res.response_metadata.next_cursor) {
          return rec(concatinatedChannels, res.response_metadata.next_cursor);
        } else {
          // 以下のエラーが出るため、必要な情報だけに絞っている
          // Error: Failed to execute 'setItem' on 'Storage': Setting the value of 'chattun_cache' exceeded the quota.
          return {
            ...res,
            channels: concatinatedChannels.map(c => ({
              id: c.id,
              is_im: c.is_im,
              name: (c as any).name,
              user: (c as any).user,
            })),
          };
        }
      });
    }
    return rec([], undefined);
  }

  addReaction(channelId: string, ts: string, reaction: string): Promise<SlackAPI.Response> {
    return reactions.add({
      token: this.token,
      name: reaction,
      channel: channelId,
      timestamp: ts,
    }) as Promise<SlackAPI.Response>;
  }
  removeReaction(channelId: string, ts: string, reaction: string): Promise<SlackAPI.Response> {
    return reactions.remove({
      token: this.token,
      name: reaction,
      channel: channelId,
      timestamp: ts,
    }) as Promise<SlackAPI.Response>;
  }
  repliesConversations(channel: string, ts: string): Promise<SlackAPI.Conversations.Replies> {
    return (conversations.replies({
      token: this.token,
      channel,
      ts,
    }) as Promise<SlackAPI.Conversations.Replies>).then(res => ({
      ...res,
      messages: res.messages.map(m => ({ ...m, channel })),
    })) as Promise<SlackAPI.Conversations.Replies>;
  }
  mark(channel: string, ts: string) {
    return channels.mark({ token: this.token, channel, ts });
  }
}
