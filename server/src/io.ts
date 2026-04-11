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
    const sessionProfile = getSessionProfileFromRequest(socket.request);
    if (!sessionProfile) {
      logger.warn('sessionProfile not found');
      socket.emit('auth_error', { reason: 'session_expired' });
      socket.disconnect();
      return;
    }
    socket.data.sessionProfile = sessionProfile;
    logger.withContext({ userId: sessionProfile.userId }, async () => {
      logger.info(`user connected userId: ${sessionProfile.userId}`);

      socket.on('disconnect', async (reason) => {
        logger.info(`user disconnected userId: ${sessionProfile.userId}`, { reason });
      });
    }).catch((err) => {
      logger.errore('error on socket connection handler', err);
    });
  });

  return io;
};
