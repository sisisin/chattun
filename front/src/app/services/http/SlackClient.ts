import { SlackAPI } from 'app/types/slack/SlackAPI';
import { EitherFactory, EitherContainer } from '../EitherContainer';
import { MockSlackClient } from './MockSlackClient';

export interface ISlackClient {
  authTest(): Promise<EitherContainer<any, any>>;
  listEmojis(): Promise<SlackAPI.Emoji.List>;
  listUsers(): Promise<SlackAPI.Users.List>;
  listChannels(): Promise<SlackAPI.Conversations.List>;
  teamInfo(): Promise<SlackAPI.Team.Info>;
  addReaction(channelId: string, ts: string, reaction: string): Promise<SlackAPI.Response>;
  removeReaction(channelId: string, ts: string, reaction: string): Promise<SlackAPI.Response>;
  repliesConversations(channel: string, ts: string): Promise<SlackAPI.Conversations.Replies>;
  mark(channel: string, ts: string): Promise<any>;
  startRtm(): Promise<SlackAPI.RTM.Start>;
}

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, { credentials: 'same-origin', ...init });
  if (!res.ok) {
    throw new Error(`Slack API proxy error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function postJson(url: string, body: Record<string, unknown>) {
  return fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

class SlackClient implements ISlackClient {
  authTest() {
    return fetchJson('/api/slack/auth.test').then(
      res => EitherFactory.createRight(res),
      err => EitherFactory.createLeft(err),
    );
  }

  listEmojis(): Promise<SlackAPI.Emoji.List> {
    return fetchJson('/api/slack/emoji.list');
  }

  listUsers(): Promise<SlackAPI.Users.List> {
    return fetchJson('/api/slack/users.list');
  }

  listChannels(): Promise<SlackAPI.Conversations.List> {
    return fetchJson('/api/slack/conversations.list');
  }

  addReaction(channelId: string, ts: string, reaction: string): Promise<SlackAPI.Response> {
    return postJson('/api/slack/reactions.add', {
      channel: channelId,
      timestamp: ts,
      name: reaction,
    });
  }

  removeReaction(channelId: string, ts: string, reaction: string): Promise<SlackAPI.Response> {
    return postJson('/api/slack/reactions.remove', {
      channel: channelId,
      timestamp: ts,
      name: reaction,
    });
  }

  repliesConversations(channel: string, ts: string): Promise<SlackAPI.Conversations.Replies> {
    return fetchJson(`/api/slack/conversations.replies?channel=${encodeURIComponent(channel)}&ts=${encodeURIComponent(ts)}`);
  }

  mark(channel: string, ts: string): Promise<any> {
    return postJson('/api/slack/conversations.mark', { channel, ts });
  }

  teamInfo(): Promise<SlackAPI.Team.Info> {
    return fetchJson('/api/slack/team.info');
  }

  startRtm(): Promise<SlackAPI.RTM.Start> {
    // RTM is no longer needed - the server handles real-time events via Socket Mode
    return Promise.resolve({ ok: true } as any);
  }
}

export const slackClient: ISlackClient =
  process.env.REACT_APP_MOCK_MODE === 'true' ? new MockSlackClient() : new SlackClient();
