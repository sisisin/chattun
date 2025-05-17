import type { AppsEventAuthorizationsListResponse } from '@slack/web-api';
import { createIOAdapter } from './redis';
import { Server } from 'socket.io';
import type * as http from 'http';
import { webClient, socketClient } from './slack';
import { logger } from './logging/logger';
import { getSessionProfileFromRequest } from './utils';

export const configureIO = (server: http.Server, middleware: (...args: any[]) => void): Server => {
  const io = new Server(server, { adapter: createIOAdapter() });

  io.use((socket, next) => {
    middleware(socket.request as any, {} as any, next as any);
  });
  io.on('connection', (socket) => {
    (async () => {
      const isActive = socketClient.websocket?.isActive() ?? false;
      if (!isActive) {
        // 一旦握りつぶしちゃう。ログ出しておくので、後で必要になったら対処する
        await socketClient.start().catch((err) => {
          logger.error('socketClient connection failed', { error: err });
        });
        logger.info('socketClient connected');
      }
      const sessionProfile = getSessionProfileFromRequest(socket.request);
      if (!sessionProfile) {
        logger.warn('sessionProfile not found');
        return;
      }
      socket.data.sessionProfile = sessionProfile;
      logger.withContext({ userId: sessionProfile.userId }, async () => {
        logger.info(`user connected userId: ${sessionProfile.userId}`);

        socket.on('disconnect', async (reason) => {
          logger.info(`user disconnected userId: ${sessionProfile.userId}`, { reason });
          const sockets = await io.local.fetchSockets();

          if (sockets.length === 0) {
            logger.info('disconnect last user. So, disconnect socketClient');
            await socketClient.disconnect();
          }
        });
      });
    })();
  });

  return io;
};
