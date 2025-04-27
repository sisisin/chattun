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
  socketClient.on('message', handlerError(handleSlackEvent));
  socketClient.on('reaction_added', handlerError(handleSlackEvent));
  socketClient.on('reaction_removed', handlerError(handleSlackEvent));

  const io = new Server(server, {
    adapter: createIOAdapter(),
  });
  io.use((socket, next) => {
    middleware(socket.request as any, {} as any, next as any);
  });
  io.on('connection', (socket) => {
    (socketClient.websocket?.isActive?.()
      ? Promise.resolve()
      : socketClient.start().then(
          () => {
            logger.info('socketClient connected');
          },
          // 一旦握りつぶしちゃう。ログ出しておくので、後で必要になったら対処する
          (err) => {
            logger.error('socketClient connection failed', { error: err });
          },
        )
    ).then(() => {
      const sessionProfile = getSessionProfileFromRequest(socket.request);
      if (!sessionProfile) {
        logger.warn('sessionProfile not found');
        return;
      }
      socket.data.sessionProfile = sessionProfile;
      logger.info(`user connected userId: ${sessionProfile.userId}`, { userId: sessionProfile.userId });

      socket.on('disconnect', (reason) => {
        logger.info(`user disconnected userId: ${sessionProfile.userId}`, { userId: sessionProfile.userId, reason });

        io.local.fetchSockets().then((sockets) => {
          if (sockets.length === 0) {
            logger.info('disconnect last user. So, disconnect socketClient');
            socketClient.disconnect();
          }
        });
      });
    });
  });

  async function handleSlackEvent(evt: any) {
    if (evt.event == null) {
      console.log(evt);

      if (evt instanceof Buffer) {
        logger.warning('buffer');
        console.log(evt.toString());
      }

      return;
    }
    const ts = new Date(Number(evt.event.ts) * 1000);
    const logSuffix = formatEventSuffix(evt, ts);
    const logObject = toLogObject(evt);

    {
      const before = new Date();
      await evt.ack();
      const after = new Date();

      logger.info(`acknowledged ${after.getTime() - ts.getTime()} ms. ${logSuffix}`, {
        time: {
          before: before.getTime(),
          after: after.getTime(),
          event_ts_raw: evt.event.ts,
          event_ts: ts.getTime(),
          ['after - ts']: after.getTime() - ts.getTime(),
          ['before - ts']: before.getTime() - ts.getTime(),
        },
        ...logObject,
      });
    }
    const sockets = await io.fetchSockets();
    if (sockets.length === 0) {
      logger.info(`no connected user. type ${logSuffix}`, toLogObject(evt));
      return;
    }

    const authorizationsSet = await listAllAuthorizations(evt.body.event_context).then(
      (a) => new Set(a.map((auth) => auth.user_id)),
    );
    const targets = sockets.filter((socket) => authorizationsSet.has(socket.data.sessionProfile.userId));

    targets.forEach((socket) => {
      socket.emit('message', evt.event);
    });
    logger.info(`event published. ${logSuffix}`, {
      targets: targets.map((t) => t.data.sessionProfile.userId),
      authorizations: Array.from(authorizationsSet),

      ...toLogObject(evt),
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

function formatEventSuffix(evt: any, ts: Date) {
  return `channel: ${evt.event.channel}, ts: ${ts.toISOString()}, type: ${evt.event.type}`;
}
function toLogObject(evt: any) {
  return {
    channel: evt.event.channel,
    ts: evt.event.ts,
    event_ts: evt.event.event_ts,
    eventType: evt.event.type,
    subType: evt.event.subtype ?? null,

    // ref. https://github.com/slackapi/node-slack-sdk/blob/aea11d0031c639cc3528312f6a04b6fc2cb87fb9/packages/socket-mode/src/SocketModeClient.ts#L333
    retry_num: evt.retry_num ?? null,
    retry_reason: evt.retry_reason ?? null,
    accepts_response_payload: evt.accepts_response_payload ?? null,
  };
}

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
      logger.error('error on slack message handler', { error: String(err), stack: err?.stack });
    });
  };
}
