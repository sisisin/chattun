import express from 'express';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import path from 'path';
import * as middleware from './middleware.ts';
import http from 'http';
import https from 'https';
import { configureSocketClient, installer, socketClient } from './slack.ts';
import { configureIO } from './io.ts';
import { port, serverBaseUrl } from './config.ts';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import { getSessionProfileFromRequest } from './utils.ts';
import { ErrorWithLogContext, logger } from './logging/logger.ts';
import { loggingMiddleware } from './logging/middleware.ts';
import slackWebApi from '@slack/web-api';
const { WebClient } = slackWebApi;

async function main() {
  const app = express();

  const server = (() => {
    if (process.env.SERVER_HTTPS === 'true') {
      const tmpDir = path.resolve(import.meta.dirname, '../../tmp');
      return https.createServer(
        {
          key: fs.readFileSync(path.join(tmpDir, 'privkey.pem')),
          cert: fs.readFileSync(path.join(tmpDir, 'fullchain.pem')),
        },
        app,
      );
    } else {
      return http.createServer(app);
    }
  })();

  const sessionMiddleware = middleware.makeSession();

  const io = configureIO(server, sessionMiddleware);
  configureSocketClient(io);

  app.use(loggingMiddleware);
  app.use(middleware.makeHelmet());
  app.set('trust proxy', 1);
  app.use(express.json());
  app.use(sessionMiddleware);
  app.use(
    express.static(path.join(import.meta.dirname, '../public'), {
      setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        }
      },
    }),
  );

  app.get('/api/foo', (req, res) => {
    logger.info('debug log', { v: req.header('X-Cloud-Trace-Context') });
    logger.info('debug log', { v: req.header('x-cloud-trace-context') });
    res.json({ bar: 'yeh' });
  });
  app.get('/api/err', (req, res) => {
    logger.info('debug log');
    throw new Error('test error');
  });

  app.get('/api/auth/slack', async (req, res, next) => {
    try {
      const url = await installer.generateInstallUrl({
        scopes: [],
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
      });
      res.redirect(url);
    } catch (error) {
      next(error);
    }
  });
  app.get('/api/slack/oauth_redirect', async (req, res, next) => {
    try {
      await installer.handleCallback(req, res, {
        success: (installation, options, callbackReq, callbackRes) => {
          if ((callbackReq as any).session) {
            (callbackReq as any).session.slack = installation;
          }
          (callbackRes as any).redirect(serverBaseUrl);
        },
      });
    } catch (error) {
      next(error);
    }
  });
  const checkAuthentication: RequestHandler = (req, res, next) => {
    const slack = getSessionProfileFromRequest(req);

    if (slack) {
      next();
    } else {
      res.status(401).end();
    }
  };

  app.get('/api/connection', checkAuthentication, (req, res) => {
    const { userId } = getSessionProfileFromRequest(req)!;

    return res.json({ userId });
  });
  app.get('/api/file', checkAuthentication, async (req, res, next) => {
    try {
      const { accessToken } = getSessionProfileFromRequest(req)!;
      const targetUrl = (req.query as any).target_url;
      if (!targetUrl || !targetUrl.startsWith('https://files.slack.com')) {
        res.status(400).end();
        return;
      }
      const upstream = await fetch(targetUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!upstream.ok) {
        res.status(upstream.status).end();
        return;
      }
      const contentType = upstream.headers.get('content-type');
      if (contentType) res.setHeader('Content-Type', contentType);
      if (!upstream.body) {
        res.status(502).end();
        return;
      }
      Readable.fromWeb(upstream.body as any).pipe(res);
    } catch (error) {
      next(error);
    }
  });
  // Slack API proxy endpoints
  const getSlackClient = (req: express.Request) => {
    const { accessToken } = getSessionProfileFromRequest(req)!;
    return new WebClient(accessToken);
  };

  app.get('/api/slack/emoji.list', checkAuthentication, async (req, res, next) => {
    try {
      const client = getSlackClient(req);
      const result = await client.emoji.list();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/slack/users.list', checkAuthentication, async (req, res, next) => {
    try {
      const client = getSlackClient(req);
      const members: any[] = [];
      let cursor: string | undefined;
      do {
        const result: any = await client.users.list({ limit: 200, cursor });
        members.push(...result.members);
        cursor = result.response_metadata?.next_cursor || undefined;
      } while (cursor);
      res.json({ ok: true, members });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/slack/conversations.list', checkAuthentication, async (req, res, next) => {
    try {
      const client = getSlackClient(req);
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
          ...result.channels.map((c: any) => ({
            id: c.id,
            is_im: c.is_im,
            is_member: c.is_member,
            name: c.name,
            user: c.user,
          })),
        );
        cursor = result.response_metadata?.next_cursor || undefined;
      } while (cursor);
      res.json({ ok: true, channels });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/slack/team.info', checkAuthentication, async (req, res, next) => {
    try {
      const client = getSlackClient(req);
      const result = await client.team.info();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/slack/reactions.add', checkAuthentication, async (req, res, next) => {
    try {
      const client = getSlackClient(req);
      const { channel, timestamp, name } = req.body;
      const result = await client.reactions.add({ channel, timestamp, name });
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/slack/reactions.remove', checkAuthentication, async (req, res, next) => {
    try {
      const client = getSlackClient(req);
      const { channel, timestamp, name } = req.body;
      const result = await client.reactions.remove({ channel, timestamp, name });
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/slack/conversations.replies', checkAuthentication, async (req, res, next) => {
    try {
      const client = getSlackClient(req);
      const channel = req.query.channel as string;
      const ts = req.query.ts as string;
      const result: any = await client.conversations.replies({ channel, ts });
      res.json({
        ...result,
        messages: result.messages.map((m: any) => ({ ...m, channel })),
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/slack/conversations.mark', checkAuthentication, async (req, res, next) => {
    try {
      const client = getSlackClient(req);
      const { channel, ts } = req.body;
      const result = await client.conversations.mark({ channel, ts });
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/slack/auth.test', checkAuthentication, async (req, res, next) => {
    try {
      const client = getSlackClient(req);
      const result = await client.auth.test();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/*', (req, res) => {
    res.status(404).end();
  });
  app.get('*', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, '../public/index.html'));
  });

  const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
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

    res.status(err?.status || 500);
    const error = req.app.get('env') === 'development' ? err : {};
    res.json({ message: err.message, ...error });
  };
  app.use(errorHandler);

  server.listen(port || 3100, () => {
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
