import { SlackAPI } from 'app/types/slack/SlackAPI';
import { WebClient } from '@slack/web-api';
import { auth, emoji, conversations, reactions, users, team, rtm } from 'slack';
import { EitherFactory } from '../EitherContainer';
import { SlackEntity } from 'app/types/slack';
import { getSessionState } from 'app/features/session/interface';

class SlackClient {
  private _client: WebClient | undefined;

  get client() {
    if (this._client === undefined) {
      this._client = new WebClient(this.getToken().token);

      // note: https://github.com/slackapi/node-slack-sdk/issues/982#issuecomment-757877215
      delete this._client['axios'].defaults.headers['User-Agent'];
    }
    return this._client;
  }

  private getToken() {
    const { accessToken } = getSessionState();
    if (accessToken === undefined) {
      throw new Error('SessionState.accessToken is uninitialized');
    }
    return { token: accessToken };
  }
  authTest() {
    return auth.test(this.getToken()).then(
      res => EitherFactory.createRight(res),
      err => EitherFactory.createLeft(err),
    );
  }

  listEmojis(): Promise<SlackAPI.Emoji.List> {
    return emoji.list(this.getToken()) as Promise<SlackAPI.Emoji.List>;
  }

  listUsers(): Promise<SlackAPI.Users.List> {
    const baseParam = { ...this.getToken(), limit: 200 };
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
      ...this.getToken(),
      types: 'public_channel',
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
      ...this.getToken(),
      name: reaction,
      channel: channelId,
      timestamp: ts,
    }) as Promise<SlackAPI.Response>;
  }
  removeReaction(channelId: string, ts: string, reaction: string): Promise<SlackAPI.Response> {
    return reactions.remove({
      ...this.getToken(),
      name: reaction,
      channel: channelId,
      timestamp: ts,
    }) as Promise<SlackAPI.Response>;
  }
  repliesConversations(channel: string, ts: string): Promise<SlackAPI.Conversations.Replies> {
    return (conversations.replies({
      ...this.getToken(),
      channel,
      ts,
    }) as Promise<SlackAPI.Conversations.Replies>).then(res => ({
      ...res,
      messages: res.messages.map(m => ({ ...m, channel })),
    })) as Promise<SlackAPI.Conversations.Replies>;
  }
  mark(channel: string, ts: string) {
    return this.client.conversations.mark({ channel: channel, ts: ts });
  }
  teamInfo(): Promise<SlackAPI.Team.Info> {
    return team.info(this.getToken()) as Promise<SlackAPI.Team.Info>;
  }
  startRtm(): Promise<SlackAPI.RTM.Start> {
    return rtm.start(this.getToken()) as Promise<SlackAPI.RTM.Start>;
  }
}

export const slackClient = new SlackClient();
