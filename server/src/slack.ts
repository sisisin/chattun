import { redis } from './redis';
import { InstallProvider } from '@slack/oauth';
import { SocketModeClient } from '@slack/socket-mode';
import { AppsEventAuthorizationsListResponse, WebClient } from '@slack/web-api';
import { slackClientId, slackClientSecret, slackAppToken } from './config';

export const installer = new InstallProvider({
  clientId: slackClientId,
  clientSecret: slackClientSecret,
  stateSecret: 'my-state-secret',

  installationStore: {
    storeInstallation: async (installation) => {
      if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
        await redis.set(installation.enterprise.id, JSON.stringify(installation));
        await redis.set(installation.user.id, JSON.stringify(installation));
        return;
      }
      if (installation.team !== undefined) {
        await redis.set(installation.team.id, JSON.stringify(installation));
        await redis.set(installation.user.id, JSON.stringify(installation));
        return;
      }
      throw new Error('Failed saving installation data to installationStore');
    },
    fetchInstallation: async (installQuery) => {
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        const res = await redis.get(installQuery.enterpriseId);
        // const res = await redis.get(installQuery.userId!);
        return JSON.parse(res!);
      }
      if (installQuery.teamId !== undefined) {
        const res = await redis.get(installQuery.teamId);
        // const res = await redis.get(installQuery.userId!);
        return JSON.parse(res!);
      }
      throw new Error('Failed fetching installation');
    },
    deleteInstallation: async (installQuery) => {
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        await redis.del(installQuery.userId!);
        return;
      }
      if (installQuery.teamId !== undefined) {
        await redis.del(installQuery.userId!);
        return;
      }
      throw new Error('Failed to delete installation');
    },
  },
});

export const webClient = new WebClient('', {
  headers: { Authorization: `Bearer ${slackAppToken}` },
});

export const socketClient = new SocketModeClient({
  appToken: slackAppToken,
});

import * as socketIO from 'socket.io';
import { logger } from './logging/logger';
const logTarget = new Set([
  'U05V1TFDXAM', // @simenyan
  'U011CM1HRHV', // @simenyan
]);

export const configureSocketClient = (io: socketIO.Server) => {
  socketClient.on(
    'message',
    handlerError((evt) => handleSlackEvent(io, evt)),
  );
  socketClient.on(
    'reaction_added',
    handlerError((evt) => handleSlackEvent(io, evt)),
  );
  socketClient.on(
    'reaction_removed',
    handlerError((evt) => handleSlackEvent(io, evt)),
  );
};

async function handleSlackEvent(io: socketIO.Server, evt: any) {
  if (evt.event == null) {
    logger.warn('event is null');

    if (evt instanceof Buffer) {
      logger.warn('buffer');
      logger.warn(evt.toString());
    }

    return;
  }
  const before = new Date();
  await evt.ack();
  const after = new Date();

  const ts = new Date(Number(evt.event.ts ?? evt.event.event_ts) * 1000);
  const logSuffix = formatEventSuffix(evt, ts);
  logger.withContext(toLogObject(evt), async () => {
    {
      logger.info(`acknowledged ${after.getTime() - ts.getTime()} ms. ${logSuffix}`, {
        time: {
          before: before.getTime(),
          after: after.getTime(),
          event_ts_raw: evt.event.ts,
          event_ts: ts.getTime(),
          ['after - ts']: after.getTime() - ts.getTime(),
          ['before - ts']: before.getTime() - ts.getTime(),
        },
      });
    }
    const sockets = await io.fetchSockets();
    if (sockets.length === 0) {
      logger.info(`no connected user. type ${logSuffix}`);
      return;
    }

    const authorizationsSet = await listAllAuthorizations(evt.body.event_context).then(
      (a) => new Set(a.map((auth) => auth.user_id)),
    );
    const targets = sockets.filter((socket) => authorizationsSet.has(socket.data.sessionProfile.userId));

    targets.forEach((socket) => {
      socket.emit('message', evt.event);
    });
    logger.info(`event published to ${targets.length} users. ${logSuffix}`, {
      targets: targets.map((t) => t.data.sessionProfile.userId),
      authorizations: Array.from(authorizationsSet),
    });

    {
      if (process.env.ENABLE_EVENT_LOG === 'true') {
        const s: any = targets.find((t) => logTarget.has(t.data.sessionProfile.userId));
        if (s) {
          logger.info('event received', { event: evt });
        }
      }
    }
  });
}

function formatEventSuffix(evt: any, ts: Date) {
  return `channel: ${evt.event.channel}, ts: ${Number.isNaN(ts.getTime()) ? 'invalid' : ts.toISOString()}, type: ${
    evt.event.type
  }`;
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
      logger.errore('error on slack message handler', err);
    });
  };
}
