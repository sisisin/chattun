const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const promisify = require('util').promisify;
const passport = require('passport');
const SlackStrategy = require('passport-slack-oauth2').Strategy;
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const helmet = require('helmet');
const passportSocketIo = require('passport.socketio');
const { getSessionConfig, serverBasePath, frontBasePathSecondary, frontBasePath, redisConfig } = require('./config');

const redisClient = redis.createClient(redisConfig);

const redisStore = new RedisStore({ client: redisClient, ttl: 86400 }); // 1day
const cors = require('cors');
module.exports = {
  redisClient: {
    get: promisify(redisClient.get).bind(redisClient),
    keys: promisify(redisClient.keys).bind(redisClient),
  },
  redisStore,
  applySession() {
    return session(getSessionConfig(redisStore));
  },
  applyPassportSocketIo() {
    return passportSocketIo.authorize({
      cookieParser: cookieParser,
      key: 'connect.sid',
      secret: 'abkl;aew',
      store: redisStore,
    });
  },
  createPassport() {
    passport.use(
      new SlackStrategy(
        {
          clientID: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          skipUserProfile: false,
          scope: ['identity.basic'],
          callbackURL: `${serverBasePath}/auth/slack/callbackTmp`,
          name: 'slack-identity',
        },
        (accessToken, refreshToken, profile, done) => {
          done(null, { accessToken, userId: profile.id });
        },
      ),
    );
    passport.use(
      new SlackStrategy(
        {
          clientID: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          skipUserProfile: false,
          scope: ['client'],
          callbackURL: `${serverBasePath}/auth/slack/callback`,
          name: 'slack-client',
        },
        (accessToken, refreshToken, profile, done) => {
          done(null, { accessToken, userId: profile.id });
        },
      ),
    );
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
    return passport;
  },
  applyCors() {
    const matchHttp = /https?:\/\//;
    const whitelist = [frontBasePath, frontBasePathSecondary].map(url => url.replace(matchHttp, ''));

    return cors({
      credentials: true,
      origin(origin, cb) {
        // allow server to server req
        if (origin === undefined) {
          return cb(null, true);
        }

        // allow only http/https scheme
        if (!matchHttp.test(origin)) {
          return cb(new Error('Not allowed scheme'));
        }
        const hostOfOrigin = origin.replace(matchHttp, '')
        const matchedDomain = whitelist
          .find(allowedHost => hostOfOrigin.indexOf(allowedHost) > -1);

        if (matchedDomain === undefined) {
          cb(new Error('Not allowed origin'));
        } else {
          cb(null, true);
        }
      },
    });
  },
  applyHelmet() {
    return helmet();
  },
};
