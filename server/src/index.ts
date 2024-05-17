import express, { ErrorRequestHandler, RequestHandler } from 'express';
import path from 'path';
import * as middleware from './middleware';
import http from 'http';
import https from 'https';
import { installer, socketClient } from './slack';
import { configureIO } from './io';
import { port, serverBaseUrl } from './config';
import request from 'request';
import fs from 'node:fs';
import { getSessionProfileFromRequest } from './utils';
import { logger, initializeLogger, configureLoggingMiddleware } from './logger';

initializeLogger();

async function main() {
  const app = express();

  const server =
    process.env.SERVER_HTTPS === 'true'
      ? https.createServer(
          {
            key: fs.readFileSync(process.env.SSL_KEY_FILE!),
            cert: fs.readFileSync(process.env.SSL_CRT_FILE!),
          },
          app,
        )
      : http.createServer(app);

  const sessionMiddleware = middleware.makeSession();

  configureIO(server, sessionMiddleware);

  await configureLoggingMiddleware(app);
  app.use(middleware.makeHelmet());
  app.set('trust proxy', 1);
  app.use(sessionMiddleware);
  app.use(express.static('public'));

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
  app.get('/api/foo', (req, res) => {
    logger.info('debug log');
    res.json({ bar: 'yeh' });
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

  const errorHandler: ErrorRequestHandler = (err, req, res) => {
    const error = req.app.get('env') === 'development' ? err : {};

    res.status(err?.status || 500);
    res.json({ message: err.message, ...error });
  };
  app.use(errorHandler);

  server.listen(port || 3100, () => {
    const addr = server.address();
    const addrString = typeof addr === 'string' ? addr : `${addr?.address}:${addr?.port}`;

    logger.info(`server running on ${addrString}`);
  });
  // NOTE: socket client のstartはserver起動時にはやらず、socket.ioのclientが1人でも現れたら行うようにする

  const shutdown = (event: string) => async () => {
    if (socketClient.connected) {
      await socketClient.removeAllListeners().disconnect();
    }
    await new Promise((done) => server.close(done));

    console.log(`server closed by ${event} signal`);
  };
  process.on('SIGTERM', shutdown('SIGTERM'));
  process.on('SIGINT', shutdown('SIGINT'));
}
main().catch((err) => console.error(err));
