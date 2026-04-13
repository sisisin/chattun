import { Hono } from 'hono';
import { installer } from '../slack.ts';
import { serverBaseUrl } from '../config.ts';
import { logger } from '../logging/logger.ts';
import {
  createSessionId,
  saveSession,
  serializeSessionCookie,
  type SessionData,
} from '../session.ts';
import { getSessionProfile } from '../utils.ts';
import { getOrFetch } from '../cache.ts';
import slackWebApi from '@slack/web-api';
import type { Env } from '../env.ts';

const { WebClient } = slackWebApi;

const getAuthProfile = (c: { get: (key: 'session') => SessionData }) => {
  const session = c.get('session');
  return getSessionProfile(session);
};

const getSlackClient = (c: { get: (key: 'session') => SessionData }) => {
  const profile = getAuthProfile(c);
  if (!profile) return null;
  return new WebClient(profile.accessToken);
};

export const apiRouter = new Hono<Env>();

// OAuth routes
apiRouter.get('/auth/slack', async c => {
  const installUrlOptions = {
    scopes: [] as string[],
    userScopes: [
      'channels:history',
      'channels:read',
      'channels:write',
      'users:read',
      'emoji:read',
      'team:read',
      'reactions:read',
      'reactions:write',
      'files:read',
    ],
    redirectUri: `${serverBaseUrl}/api/slack/oauth_redirect`,
  };
  const { incoming, outgoing } = c.env;
  await installer.handleInstallPath(incoming, outgoing, {}, installUrlOptions);
  return new Response(null, { headers: { 'x-hono-already-sent': '1' } });
});

apiRouter.get('/slack/oauth_redirect', async c => {
  const { incoming, outgoing } = c.env;

  let installation: any = null;
  let failureError: Error | null = null;

  try {
    await installer.handleCallback(incoming, outgoing, {
      success: inst => {
        installation = inst;
      },
      failure: error => {
        failureError = error;
      },
    });
  } catch (err) {
    logger.errore('OAuth callback error', err);
    return c.text('OAuth failed', 500);
  }

  if (failureError) {
    logger.errore('OAuth callback failure', failureError);
    return c.text('OAuth failed', 500);
  }

  if (installation) {
    const sessionId = createSessionId();
    await saveSession(sessionId, { slack: installation });
    c.header('Set-Cookie', serializeSessionCookie(sessionId));
    return c.redirect(serverBaseUrl, 302);
  }

  return c.text('OAuth failed', 500);
});

// Authenticated API routes
apiRouter.get('/connection', c => {
  const profile = getAuthProfile(c);
  if (!profile) return c.body(null, 401);
  return c.json({ userId: profile.userId });
});

apiRouter.get('/file', async c => {
  const profile = getAuthProfile(c);
  if (!profile) return c.body(null, 401);

  const targetUrl = c.req.query('target_url');
  if (!targetUrl || !targetUrl.startsWith('https://files.slack.com')) {
    return c.body(null, 400);
  }

  const upstream = await fetch(targetUrl, {
    headers: { Authorization: `Bearer ${profile.accessToken}` },
  });
  if (!upstream.ok) {
    return c.body(null, upstream.status as any);
  }
  if (!upstream.body) {
    return c.body(null, 502);
  }

  const contentType = upstream.headers.get('content-type');
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  return new Response(upstream.body, { headers });
});

// Slack API proxy routes
apiRouter.get('/slack/emoji.list', async c => {
  const client = getSlackClient(c);
  if (!client) return c.body(null, 401);
  const result = await getOrFetch('emoji:list', () => client.emoji.list());
  return c.json(result);
});

apiRouter.get('/slack/users.list', async c => {
  const client = getSlackClient(c);
  if (!client) return c.body(null, 401);
  const data = await getOrFetch('users:list', async () => {
    const members: any[] = [];
    let cursor: string | undefined;
    do {
      const result: any = await client.users.list({ limit: 200, cursor });
      members.push(...result.members);
      cursor = result.response_metadata?.next_cursor || undefined;
    } while (cursor);
    return { ok: true, members };
  });
  return c.json(data);
});

apiRouter.get('/slack/conversations.list', async c => {
  const profile = getAuthProfile(c);
  if (!profile) return c.body(null, 401);
  const client = new WebClient(profile.accessToken);
  const data = await getOrFetch(`conversations:list:${profile.userId}`, async () => {
    const channels: any[] = [];
    let cursor: string | undefined;
    do {
      const result: any = await client.conversations.list({
        types: 'public_channel',
        exclude_archived: true,
        limit: 200,
        cursor,
      });
      channels.push(
        ...result.channels.map((ch: any) => ({
          id: ch.id,
          is_im: ch.is_im,
          is_member: ch.is_member,
          name: ch.name,
          user: ch.user,
        })),
      );
      cursor = result.response_metadata?.next_cursor || undefined;
    } while (cursor);
    return { ok: true, channels };
  });
  return c.json(data);
});

apiRouter.get('/slack/team.info', async c => {
  const client = getSlackClient(c);
  if (!client) return c.body(null, 401);
  const result = await getOrFetch('team:info', () => client.team.info());
  return c.json(result);
});

apiRouter.post('/slack/reactions.add', async c => {
  const client = getSlackClient(c);
  if (!client) return c.body(null, 401);
  const { channel, timestamp, name } = await c.req.json();
  const result = await client.reactions.add({ channel, timestamp, name });
  return c.json(result);
});

apiRouter.post('/slack/reactions.remove', async c => {
  const client = getSlackClient(c);
  if (!client) return c.body(null, 401);
  const { channel, timestamp, name } = await c.req.json();
  const result = await client.reactions.remove({ channel, timestamp, name });
  return c.json(result);
});

apiRouter.get('/slack/conversations.replies', async c => {
  const client = getSlackClient(c);
  if (!client) return c.body(null, 401);
  const channel = c.req.query('channel')!;
  const ts = c.req.query('ts')!;
  const result: any = await client.conversations.replies({ channel, ts });
  return c.json({
    ...result,
    messages: result.messages.map((m: any) => ({ ...m, channel })),
  });
});

apiRouter.post('/slack/conversations.mark', async c => {
  const client = getSlackClient(c);
  if (!client) return c.body(null, 401);
  const { channel, ts } = await c.req.json();
  const result = await client.conversations.mark({ channel, ts });
  return c.json(result);
});

apiRouter.get('/slack/auth.test', async c => {
  const client = getSlackClient(c);
  if (!client) return c.body(null, 401);
  const result = await client.auth.test();
  return c.json(result);
});

// API catch-all 404
apiRouter.all('/*', c => c.body(null, 404));
