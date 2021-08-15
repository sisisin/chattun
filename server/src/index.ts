import express, { ErrorRequestHandler, RequestHandler } from 'express';
import path from 'path';
import * as middleware from './middleware';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { installer, socketClient } from './slack';
import { configureIO } from './io';
import { useHttp, privateKeyPath, certPath, port, frontBaseUrl, serverBaseUrl } from './config';
import request from 'request';

const app = express();

const server = configureServer();
function configureServer() {
  if (useHttp) {
    return http.createServer(app);
  } else {
    const key = fs.readFileSync(privateKeyPath, 'utf-8');
    const cert = fs.readFileSync(certPath, 'utf-8');
    return https.createServer({ key, cert }, app);
  }
}

const sessionMiddleware = middleware.makeSession();

configureIO(server, sessionMiddleware);

app.use(middleware.applyHelmet());
app.set('trust proxy', 1);
app.use(sessionMiddleware);
app.use(express.static('public'));

// for debug
app.get('/slack/install', async (req, res, next) => {
  try {
    const url = await installer.generateInstallUrl({
      scopes: [],
      userScopes: ['channels:read', 'channels:history', 'im:history'],
    });

    res.send(
      `<a href=${url}><img alt=""Add to Slack"" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>`,
    );
  } catch (error) {
    next(error);
  }
});
app.get('/auth/slack', async (req, res, next) => {
  try {
    const url = await installer.generateInstallUrl({
      scopes: [],
      userScopes: [
        'channels:history',
        'channels:read',
        'channels:write',
        'users:read',
        'emoji:read',
        'team:read',
        'reactions:read',
        'reactions:write',
        'files:read',
      ],
      // todo: url in prod
      redirectUri: `${serverBaseUrl}/slack/oauth_redirect`,
    });
    res.redirect(url);
  } catch (error) {
    next(error);
  }
});
app.get('/slack/oauth_redirect', async (req, res, next) => {
  try {
    await installer.handleCallback(req, res, {
      success: (installation, options, callbackReq, callbackRes) => {
        if ((callbackReq as any).session) {
          (callbackReq as any).session.slack = installation;
        }
        // todo: url in production
        (callbackRes as any).redirect(frontBaseUrl);
      },
    });
  } catch (error) {
    next(error);
  }
});
app.get('/foo', (req, res) => {
  res.json({ bar: 'yeh' });
});
const checkAuthentication: RequestHandler = (req, res, next) => {
  const slack = getSessionProfileFromRequest(req);

  if (slack) {
    next();
  } else {
    res.status(401).end();
  }
};

app.get('/connection', checkAuthentication, (req, res) => {
  const { accessToken, userId } = getSessionProfileFromRequest(req)!;

  return res.json({ accessToken, userId });
});
app.get('/file', checkAuthentication, (req, res) => {
  const { accessToken } = getSessionProfileFromRequest(req)!;
  const isValidTargetUrl = (req.query as any).target_url.startsWith('https://files.slack.com');
  if (isValidTargetUrl) {
    request({
      url: req.query.target_url as string,
      headers: { Authorization: `Bearer ${accessToken}` },
    }).pipe(res);
  } else {
    res.status(400).end();
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const error = req.app.get('env') === 'development' ? err : {};

  res.status(err?.status || 500);
  res.json({ message: err.message, ...error });
};
app.use(errorHandler);

function getSessionProfileFromRequest(req: any) {
  if (!(req.session as any)?.slack?.user) {
    return undefined;
  }

  const { token, id } = (req.session as any)?.slack?.user;

  return { accessToken: token, userId: id };
}

async function main() {
  server.listen(port || 3100, () => {
    console.log(`server running`);
  });

  await socketClient.start();
}
main().catch((err) => console.error(err));
