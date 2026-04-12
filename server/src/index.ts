import { Hono } from 'hono';
import type { HttpBindings } from '@hono/node-server';
import { createAdaptorServer } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { secureHeaders } from 'hono/secure-headers';
import path from 'path';
import https from 'https';
import fs from 'node:fs';
import { configureSocketClient, installer, socketClient } from './slack.ts';
import { configureIO } from './io.ts';
import { port, serverBaseUrl } from './config.ts';
import { ErrorWithLogContext, logger } from './logging/logger.ts';
import { loggingMiddleware } from './logging/middleware.ts';
import {
  sessionMiddleware,
  createSessionId,
  saveSession,
  serializeSessionCookie,
  type SessionData,
} from './session.ts';
import { getSessionProfile } from './utils.ts';
import slackWebApi from '@slack/web-api';
const { WebClient } = slackWebApi;

type Env = {
  Bindings: HttpBindings;
  Variables: {
    session: SessionData;
    sessionId: string | undefined;
  };
};

async function main() {
  const app = new Hono<Env>();

  // Global middleware
  app.use(loggingMiddleware);
  app.use(secureHeaders());

  // Static files (before session to avoid unnecessary Redis lookups)
  app.use(
    '/*',
    serveStatic({
      root: path.relative(process.cwd(), path.join(import.meta.dirname, '../public')),
    }),
  );

  // Session middleware
  app.use(sessionMiddleware);

  // OAuth routes
  app.get('/api/auth/slack', async c => {
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
    // handleInstallPath writes the response directly to outgoing (res.writeHead + res.end).
    // Signal @hono/node-server to skip writing to outgoing again.
    return new Response(null, { headers: { 'x-hono-already-sent': '1' } });
  });

  app.get('/api/slack/oauth_redirect', async c => {
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

  // Auth check helper
  const getAuthProfile = (c: { get: (key: 'session') => SessionData }) => {
    const session = c.get('session');
    return getSessionProfile(session);
  };

  // Authenticated API routes
  app.get('/api/connection', c => {
    const profile = getAuthProfile(c);
    if (!profile) return c.body(null, 401);
    return c.json({ userId: profile.userId });
  });

  app.get('/api/file', async c => {
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

  // Slack API proxy helper
  const getSlackClient = (c: { get: (key: 'session') => SessionData }) => {
    const profile = getAuthProfile(c);
    if (!profile) return null;
    return new WebClient(profile.accessToken);
  };

  app.get('/api/slack/emoji.list', async c => {
    const client = getSlackClient(c);
    if (!client) return c.body(null, 401);
    const result = await client.emoji.list();
    return c.json(result);
  });

  app.get('/api/slack/users.list', async c => {
    const client = getSlackClient(c);
    if (!client) return c.body(null, 401);
    const members: any[] = [];
    let cursor: string | undefined;
    do {
      const result: any = await client.users.list({ limit: 200, cursor });
      members.push(...result.members);
      cursor = result.response_metadata?.next_cursor || undefined;
    } while (cursor);
    return c.json({ ok: true, members });
  });

  app.get('/api/slack/conversations.list', async c => {
    const client = getSlackClient(c);
    if (!client) return c.body(null, 401);
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
    return c.json({ ok: true, channels });
  });

  app.get('/api/slack/team.info', async c => {
    const client = getSlackClient(c);
    if (!client) return c.body(null, 401);
    const result = await client.team.info();
    return c.json(result);
  });

  app.post('/api/slack/reactions.add', async c => {
    const client = getSlackClient(c);
    if (!client) return c.body(null, 401);
    const { channel, timestamp, name } = await c.req.json();
    const result = await client.reactions.add({ channel, timestamp, name });
    return c.json(result);
  });

  app.post('/api/slack/reactions.remove', async c => {
    const client = getSlackClient(c);
    if (!client) return c.body(null, 401);
    const { channel, timestamp, name } = await c.req.json();
    const result = await client.reactions.remove({ channel, timestamp, name });
    return c.json(result);
  });

  app.get('/api/slack/conversations.replies', async c => {
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

  app.post('/api/slack/conversations.mark', async c => {
    const client = getSlackClient(c);
    if (!client) return c.body(null, 401);
    const { channel, ts } = await c.req.json();
    const result = await client.conversations.mark({ channel, ts });
    return c.json(result);
  });

  app.get('/api/slack/auth.test', async c => {
    const client = getSlackClient(c);
    if (!client) return c.body(null, 401);
    const result = await client.auth.test();
    return c.json(result);
  });

  // API catch-all 404
  app.all('/api/*', c => c.body(null, 404));

  // SPA fallback
  app.get('*', c => {
    const filePath = path.join(import.meta.dirname, '../public/index.html');
    try {
      const html = fs.readFileSync(filePath, 'utf-8');
      return c.html(html);
    } catch {
      return c.notFound();
    }
  });

  // Error handler
  app.onError((err, c) => {
    if (err instanceof Error) {
      if (err instanceof ErrorWithLogContext) {
        const [context, cause] = err.unwrapAndGetContext();
        logger.errore(`Error processing request: ${cause}`, cause, context);
      } else {
        logger.errore(`Error processing request: ${err.message}`, err);
      }
    } else {
      logger.errore(`Error processing request: ${err}`, err);
    }

    const status = (err as any)?.status || 500;
    return c.json({ message: (err as Error).message ?? String(err) }, status);
  });

  // Create HTTP(S) server
  const serverOptions = (() => {
    if (process.env.SERVER_HTTPS === 'true') {
      const tmpDir = path.resolve(import.meta.dirname, '../../tmp');
      return {
        createServer: https.createServer as any,
        serverOptions: {
          key: fs.readFileSync(path.join(tmpDir, 'privkey.pem')),
          cert: fs.readFileSync(path.join(tmpDir, 'fullchain.pem')),
        },
      };
    }
    return {};
  })();

  const server = createAdaptorServer({
    fetch: app.fetch,
    ...serverOptions,
  });

  const io = configureIO(server as import('http').Server);
  configureSocketClient(io);

  server.listen(Number(port) || 3100, () => {
    const addr = server.address();
    const addrString = typeof addr === 'string' ? addr : `${addr?.address}:${addr?.port}`;
    logger.info(`server running on ${addrString}`);
  });
  socketClient.start();

  const shutdown = (event: string) => async () => {
    logger.info(`Received ${event} signal, shutting down...`);
    try {
      await socketClient.disconnect();
      socketClient.removeAllListeners();

      io.close();
      await new Promise(done => server.close(done));
      logger.info(`server closed by ${event} signal`);
      process.exit(0);
    } catch (err) {
      logger.error(`Error during shutdown: ${err}`);
      process.exit(1);
    }
  };
  process.on('SIGTERM', shutdown('SIGTERM'));
  process.on('SIGINT', shutdown('SIGINT'));
}

// プロセスをクラッシュさせずに構造化ログへ記録する。
// Cloud Run上でunhandled rejectionによるexit(1)→インスタンス再起動の連鎖を防止する意図的な設計。
process.on('unhandledRejection', reason => {
  if (reason instanceof ErrorWithLogContext) {
    const [context, cause] = reason.unwrapAndGetContext();
    logger.errore('Unhandled rejection', cause, context);
  } else {
    logger.errore('Unhandled rejection', reason);
  }
});
process.on('uncaughtException', err => {
  logger.errore('Uncaught exception', err);
  process.exit(1);
});

main().catch(err => {
  logger.errore('Failed to start server', err);
  process.exit(1);
});
