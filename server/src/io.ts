import type { AppsEventAuthorizationsListResponse } from '@slack/web-api';
import { createIOAdapter } from './redis';
import { Server } from 'socket.io';
import type * as http from 'http';
import { webClient, socketClient } from './slack';
import { logger } from './logger';
import { getSessionProfileFromRequest } from './utils';

const logTarget = new Set([
  'U05V1TFDXAM', // @simenyan
  'U011CM1HRHV', // @simenyan
]);

export const configureIO = (server: http.Server, middleware: (...args: any[]) => void) => {
  const io = new Server(server, {
    adapter: createIOAdapter(),
  });
  io.use((socket, next) => {
    middleware(socket.request as any, {} as any, next as any);
  });
  io.on('connection', (socket) => {
    const sessionProfile = getSessionProfileFromRequest(socket.request);
    if (!sessionProfile) {
      logger.warn('sessionProfile not found');
      return;
    }
    socket.data.sessionProfile = sessionProfile;
    logger.info(`user connected userId: ${sessionProfile.userId}`, { userId: sessionProfile.userId });

    socket.on('disconnect', (reason) => {
      logger.info(`user disconnected userId: ${sessionProfile.userId}`, { userId: sessionProfile.userId, reason });
    });
  });

  socketClient.on('message', handlerError(handleSlackEvent));
  socketClient.on('reaction_added', handlerError(handleSlackEvent));
  socketClient.on('reaction_removed', handlerError(handleSlackEvent));

  async function handleSlackEvent(evt: any) {
    {
      const before = new Date();
      await evt.ack();
      const after = new Date();
      const ts = new Date(Number(evt.event.event_ts) * 1000);

      logger.info(`acknowledged ${after.getTime() - ts.getTime()} ms`, {
        before: before.getTime(),
        after: after.getTime(),
        event_ts_raw: evt.event.event_ts,
        event_ts: ts.getTime(),
        ['after - ts']: after.getTime() - ts.getTime(),
        ['before -ts']: before.getTime() - ts.getTime(),
      });
    }
    const sockets = await io.fetchSockets();
    if (sockets.length === 0) {
      return;
    }

    const authorizationsSet = await listAllAuthorizations(evt.body.event_context).then(
      (a) => new Set(a.map((auth) => auth.user_id)),
    );
    const targets = sockets.filter((socket) => authorizationsSet.has(socket.data.sessionProfile.userId));

    targets.forEach((socket) => {
      socket.emit('message', evt.event);
    });
    logger.info(`event published. type: ${evt.event.type}`, {
      channel: evt.event.channel,
      ts: evt.event.ts,
      event_ts: evt.event.event_ts,
      eventType: evt.event.type,
      subType: evt.event.subtype ?? null,
      targets: targets.map((t) => t.data.sessionProfile.userId),
      authorizations: Array.from(authorizationsSet),
      // ref. https://github.com/slackapi/node-slack-sdk/blob/aea11d0031c639cc3528312f6a04b6fc2cb87fb9/packages/socket-mode/src/SocketModeClient.ts#L333
      retry_num: evt.retry_num ?? null,
      retry_reason: evt.retry_reason ?? null,
      accepts_response_payload: evt.accepts_response_payload ?? null,
    });

    {
      if (process.env.ENABLE_EVENT_LOG === 'true') {
        const s: any = targets.find((t) => logTarget.has(t.data.sessionProfile.userId));
        if (s) {
          logger.info('event received', evt);
        }
      }
    }
  }
};
async function listAllAuthorizations(eventContext: string) {
  const authorizations: AppsEventAuthorizationsListResponse['authorizations'] = [];
  let cursor;

  do {
    const res: AppsEventAuthorizationsListResponse = await webClient.apps.event.authorizations.list({
      cursor,
      event_context: eventContext,
    });

    authorizations.push(...(res.authorizations ?? []));
    cursor = res.response_metadata?.next_cursor;
  } while (cursor);

  return authorizations;
}

function handlerError<T extends any[]>(cb: (...args: T) => Promise<void>) {
  return (...args: T) => {
    cb(...args).catch((err) => {
      logger.error('error on slack message handler', { error: err });
    });
  };
}
