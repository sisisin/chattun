import { App, SocketModeReceiver } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { redis } from './redis';
import { logger } from './logger';

const appToken = process.env.SLACK_APP_TOKEN!;
const socketModeReceiver = new SocketModeReceiver({
  appToken,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  // scopes: ['channels:read', 'channels:history', 'im:history'],
  scopes: [],
  installerOptions: { userScopes: ['channels:read', 'channels:history', 'im:history'] },
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

const app = new App({
  receiver: socketModeReceiver,
  socketMode: true,
  ignoreSelf: false,
});
const webClient = new WebClient('', {
  headers: { Authorization: `Bearer ${appToken}` },
});
app.event('message', async ({ client, ...args }) => {
  const res = await webClient.apps.event.authorizations.list({
    event_context: args.body.event_context,
  });
  logger.log('-----------------------------');
  logger.log(args.body.event.subtype === undefined ? args.body.event.text : 'nothing');
  logger.log(res.authorizations);
  // logger.log(args);
  logger.log(args.body.authorizations);
});

(async () => {
  await app.start();
  logger.log('⚡️ Bolt app started');
})();
