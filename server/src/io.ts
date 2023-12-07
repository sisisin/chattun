import { Server, Socket } from 'socket.io';
import type * as http from 'http';
import { webClient, slackEmitter } from './slack';
import { logger } from './logger';
import { getSessionProfileFromRequest } from './utils';

const logTarget = new Set([
  'U05V1TFDXAM', // @simenyan
]);

export const configureIO = (server: http.Server, middleware: (...args: any[]) => void) => {
  const io = new Server(server);
  io.use((socket, next) => {
    middleware(socket.request as any, {} as any, next as any);
  });
  io.on('connection', (socket) => {
    const listener = async (evt: any) => {
      evt.ack();

      const sessionProfile = getSessionProfileFromRequest(socket.request);
      if (!sessionProfile) {
        logger.logJ('sessionProfile not found', {});
        return;
      }

      const authorizations: { user_id: string }[] = evt.body.authorizations;

      let matched = authorizations?.some((auth) => auth.user_id === sessionProfile.userId);
      if (matched) {
        socket.emit('message', evt.event);
      } else {
        const res = await webClient.apps.event.authorizations.list({
          event_context: evt.body.event_context,
        });

        matched = res.authorizations?.some((auth) => auth.user_id === sessionProfile.userId) ?? false;
        if (matched) {
          socket.emit('message', evt.event);
        }
      }

      logger.logJ('event matched', { matched, userId: sessionProfile.userId });
      if (process.env.ENABLE_EVENT_LOG === 'true' && logTarget.has(sessionProfile.userId)) {
        logger.logJ('on event', {
          eventType: evt.event.type,
          subType: evt.event.subtype ?? null,
          userId: sessionProfile.userId,
        });
      }
    };

    slackEmitter.on('message', listener);
    socket.on('disconnect', () => {
      slackEmitter.removeListener('message', listener);
    });
  });
};
