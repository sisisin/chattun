import { SlackAPI } from 'app/types/slack/SlackAPI';
import { EitherFactory } from '../EitherContainer';
import { ISlackClient } from './SlackClient';

let bootstrapCache: any = null;

async function fetchBootstrap() {
  if (bootstrapCache) return bootstrapCache;
  const res = await fetch('/api/mock/bootstrap');
  bootstrapCache = await res.json();
  return bootstrapCache;
}

export class MockSlackClient implements ISlackClient {
  authTest() {
    return Promise.resolve(EitherFactory.createRight({ ok: true }));
  }

  async listEmojis(): Promise<SlackAPI.Emoji.List> {
    const data = await fetchBootstrap();
    return data.emojis;
  }

  async listUsers(): Promise<SlackAPI.Users.List> {
    const data = await fetchBootstrap();
    return data.users;
  }

  async listChannels(): Promise<SlackAPI.Conversations.List> {
    const data = await fetchBootstrap();
    return data.channels;
  }

  async teamInfo(): Promise<SlackAPI.Team.Info> {
    const data = await fetchBootstrap();
    return data.teamInfo;
  }

  addReaction(_channelId: string, _ts: string, _reaction: string): Promise<SlackAPI.Response> {
    console.log('[mock] addReaction (no-op)');
    return Promise.resolve({ ok: true });
  }

  removeReaction(_channelId: string, _ts: string, _reaction: string): Promise<SlackAPI.Response> {
    console.log('[mock] removeReaction (no-op)');
    return Promise.resolve({ ok: true });
  }

  async repliesConversations(
    _channel: string,
    _ts: string,
  ): Promise<SlackAPI.Conversations.Replies> {
    return { ok: true, has_more: false, messages: [] };
  }

  mark(_channel: string, _ts: string) {
    console.log('[mock] mark (no-op)');
    return Promise.resolve({ ok: true });
  }

  startRtm(): Promise<SlackAPI.RTM.Start> {
    return Promise.resolve({ ok: true, url: '' });
  }
}
