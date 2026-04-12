import { createIOAdapter } from './redis.ts';
import { Server } from 'socket.io';
import type * as http from 'http';
import { logger } from './logging/logger.ts';
import { getSessionProfile } from './utils.ts';
import { loadSessionFromCookieHeader } from './session.ts';

export const configureIO = (server: http.Server): Server => {
  const io = new Server(server, { adapter: createIOAdapter() });

  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.request.headers.cookie;
      const { data } = await loadSessionFromCookieHeader(cookieHeader);
      (socket.request as any).__session = data;
      next();
    } catch (err) {
      next(err as Error);
    }
  });

  io.on('connection', socket => {
    const sessionProfile = getSessionProfile((socket.request as any).__session ?? {});
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
