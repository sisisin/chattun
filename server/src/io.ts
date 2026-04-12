import { createIOAdapter } from './redis.ts';
import { Server } from 'socket.io';
import type * as http from 'http';
import { logger } from './logging/logger.ts';
import { getSessionProfileFromRequest } from './utils.ts';

export const configureIO = (server: http.Server, middleware: (...args: any[]) => void): Server => {
  const io = new Server(server, { adapter: createIOAdapter() });

  io.use((socket, next) => {
    middleware(socket.request as any, {} as any, next as any);
  });
  io.on('connection', socket => {
    const sessionProfile = getSessionProfileFromRequest(socket.request);
    if (!sessionProfile) {
      logger.warn('sessionProfile not found');
      socket.disconnect(true);
      return;
    }
    socket.data.sessionProfile = sessionProfile;
    logger
      .withContext({ userId: sessionProfile.userId }, async () => {
        logger.info(`user connected userId: ${sessionProfile.userId}`);

        socket.on('disconnect', async reason => {
          logger.info(`user disconnected userId: ${sessionProfile.userId}`, { reason });
        });
      })
      .catch(err => {
        logger.errore('error on socket connection handler', err);
      });
  });

  return io;
};
