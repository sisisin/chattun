import { WebClient } from '@slack/web-api';
import { redis } from './redis';
import { logger } from './logger';
import { InstallProvider } from '@slack/oauth';
import express, { ErrorRequestHandler } from 'express';
import { SocketModeClient } from '@slack/socket-mode';
import path from 'path';
import * as middleware from './middleware';

const appToken = process.env.SLACK_APP_TOKEN!;
const socketClient = new SocketModeClient({ appToken });
const app = express();
const installer = new InstallProvider({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
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

app.use(middleware.applyHelmet());
app.set('trust proxy', 1);
app.use(middleware.applySession());
app.use(express.static('public'));

app.get('/slack/install', async (req, res, next) => {
  try {
    const url = await installer.generateInstallUrl({
      scopes: [],
      userScopes: ['channels:read', 'channels:history', 'im:history'],
      metadata: 'some_metadata',
    });

    res.send(
      `<a href=${url}><img alt=""Add to Slack"" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>`,
    );
  } catch (error) {
    next(error);
  }
});
app.get('/slack/oauth_redirect', async (req, res, next) => {
  try {
    // todo: handle followings
    // save installation to session,redirect to /login
    await installer.handleCallback(req, res);
  } catch (error) {
    next(error);
  }
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
const webClient = new WebClient('', {
  headers: { Authorization: `Bearer ${appToken}` },
});

socketClient.on('message', async ({ ...args }) => {
  // console.log(event);
  const res = await webClient.apps.event.authorizations.list({
    event_context: args.body.event_context,
  });
  logger.log('-----------------------------');
  logger.log(args.body.event.subtype === undefined ? args.body.event.text : 'nothing');
  logger.log(res.authorizations);
  // logger.log(args);
  logger.log(args.body.authorizations);
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const error = req.app.get('env') === 'development' ? err : {};

  res.status(err?.status || 500);
  res.json({ message: err.message, ...error });
};
app.use(errorHandler);

async function main() {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`server running`);
  });

  await socketClient.start();
}
main().catch((err) => console.error(err));
