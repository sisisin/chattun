import express, { ErrorRequestHandler, RequestHandler } from 'express';
import path from 'path';
import * as middleware from './middleware';
import http from 'http';
import https from 'https';
import { configureSocketClient, installer, socketClient } from './slack';
import { configureIO } from './io';
import { port, serverBaseUrl } from './config';
import request from 'request';
import fs from 'node:fs';
import { getSessionProfileFromRequest } from './utils';
import { ErrorWithLogContext, logger } from './logging/logger';
import { loggingMiddleware } from './logging/middleware';

async function main() {
  const app = express();

  const server = (() => {
    if (process.env.SERVER_HTTPS === 'true') {
      const tmpDir = path.resolve(__dirname, '../../tmp');
      return https.createServer(
        {
          key: fs.readFileSync(path.join(tmpDir, 'privkey.pem')),
          cert: fs.readFileSync(path.join(tmpDir, 'cert.pem')),
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
  app.use(sessionMiddleware);
  app.use(
    express.static(path.join(__dirname, '../public'), {
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
    const { accessToken, userId } = getSessionProfileFromRequest(req)!;

    return res.json({ accessToken, userId });
  });
  app.get('/api/file', checkAuthentication, (req, res) => {
    const { accessToken } = getSessionProfileFromRequest(req)!;
    const isValidTargetUrl = (req.query as any).target_url.startsWith('https://files.slack.com');
    if (isValidTargetUrl) {
      request({
        url: req.query.target_url as string,
        headers: { Authorization: `Bearer ${accessToken}` },
      }).pipe(res);
    } else {
      res.status(400).end();
    }
  });
  app.get('/api/*', (req, res) => {
    res.status(404).end();
  });
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
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
      await new Promise((done) => server.close(done));
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
main().catch((err) => console.error(err));
