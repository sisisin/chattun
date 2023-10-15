import { redis } from './redis';
import { InstallProvider } from '@slack/oauth';
import { EventEmitter } from 'events';
import { SocketModeClient } from '@slack/socket-mode';
import { WebClient } from '@slack/web-api';
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

export const socketClient = new SocketModeClient({ appToken: slackAppToken, autoReconnectEnabled: true });
export const slackEmitter = new EventEmitter();
socketClient.on('message', (args) => {
  slackEmitter.emit('message', args);
});
socketClient.on('reaction_added', (args) => {
  slackEmitter.emit('message', args);
});
socketClient.on('reaction_removed', (args) => {
  slackEmitter.emit('message', args);
});
