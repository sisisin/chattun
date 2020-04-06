const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, { cookie: false });
const middlewares = require('./src/middleware');
const { startSocket, hasClient } = require('./src/socket');
const createError = require('http-errors');
const logger = require('morgan');
const _ = require('lodash');
const { serverBasePath, frontBasePath } = require('./src/config');

app.use(middlewares.applyHelmet());
app.set('trust proxy', 1);
app.use(middlewares.applySession());

const passport = middlewares.createPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(middlewares.applyCors());
io.use(middlewares.applyPassportSocketIo());
// for rebooting server
(async () => {
  let sessions;
  try {
    const keys = await middlewares.redisClient.keys('sess:*');
    sessions = await Promise.all(keys.map(key => middlewares.redisClient.get(key)));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  _.chain(sessions)
    .map(s => {
      try {
        return JSON.parse(s);
      } catch (e) {
        return undefined;
      }
    })
    .filter(s => s && s.passport && s.passport.user)
    .groupBy(s => s.passport.user.userId)
    .forEach(async ([s]) => {
      try {
        await startSocket(io, s.passport.user);
      } catch (e) {
        console.error(e); // todo: これ起きたときのアプリの振る舞い考えないとアレ
      }
    })
    .value();
})();

app.get('/debug', (req, res) => {
  res.status(200).end();
});

// todo: CSRF対策
app.post('/connection', (req, res) => {
  if (!(req.session && req.session.passport && req.session.passport.user)) {
    return res.status(401).end();
  }
  const { userId, accessToken } = req.session.passport.user;

  if (!(userId && accessToken)) {
    return res.status(401).end();
  }

  if (hasClient(userId)) {
    return res.json({ userId, accessToken });
  }
  // note: async function使うと例外が出たときにunhandledRjectionをルーター処理内でcatch出来なくてサーバーが応答できなくなるので仕方なくpromiseチェインでやってる
  return startSocket(io, { userId, accessToken })
    .then(() => {
      res.json({ userId, accessToken });
    })
    .catch(err => {
      res.status(401).end();
    });
});

app.get('/auth/slack', passport.authorize('slack-identity'));

app.get('/auth/slack/client', passport.authorize('slack-client'));

app.get(
  '/auth/slack/callbackTmp',
  passport.authenticate('slack-identity', { failureRedirect: `${frontBasePath}` }),
  (req, res) => res.redirect(`${serverBasePath}/auth/slack/client`),
);

app.get(
  '/auth/slack/callback',
  passport.authenticate('slack-client', { failureRedirect: `${frontBasePath}` }),
  (req, res) => res.redirect(frontBasePath),
);

app.use((_, __, next) => next(createError(404)));
app.use(function (err, req, res) {
  const error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ message: err.message, ...error });
});

http.listen(process.env.PORT || 3100, () => {
  console.log(`server running at ${serverBasePath}`);
});
