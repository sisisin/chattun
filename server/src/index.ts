import { Hono } from 'hono';
import { createAdaptorServer } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { secureHeaders } from 'hono/secure-headers';
import path from 'path';
import https from 'https';
import fs from 'node:fs';
import { configureSocketClient, socketClient } from './slack.ts';
import { configureIO } from './io.ts';
import { port } from './config.ts';
import { ErrorWithLogContext, logger } from './logging/logger.ts';
import { loggingMiddleware } from './logging/middleware.ts';
import { sessionMiddleware } from './session.ts';
import { apiRouter } from './router/api.ts';
import type { Env } from './env.ts';

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

  // API routes
  app.route('/api', apiRouter);

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

process.on('unhandledRejection', reason => {
  if (reason instanceof ErrorWithLogContext) {
    const [context, cause] = reason.unwrapAndGetContext();
    logger.errore('Unhandled rejection', cause, context);
  } else {
    logger.errore('Unhandled rejection', reason);
  }
  process.exit(1);
});
process.on('uncaughtException', err => {
  logger.errore('Uncaught exception', err);
  process.exit(1);
});

main().catch(err => {
  logger.errore('Failed to start server', err);
  process.exit(1);
});
