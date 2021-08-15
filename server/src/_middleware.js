const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const passport = require('passport');
const SlackStrategy = require('passport-slack-oauth2').Strategy;
const helmet = require('helmet');
const { serverBaseUrl, redisConfig, slackAppConfig, isProduction } = require('./_config');

const redisClient = redis.createClient(redisConfig);

const redisStore = new RedisStore({ client: redisClient, ttl: 86400 }); // 1day
module.exports = {
  redisStore,
  applySession() {
    return session({
      store: redisStore,
      name: 'connect.sid',
      secret: 'abkl;aew',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction,
        httpOnly: true,
        path: '/',
        sameSite: isProduction ? 'none' : false,
      },
    });
  },

  createPassport() {
    passport.use(
      new SlackStrategy(
        {
          ...slackAppConfig,
          skipUserProfile: false,
          scope: ['identity.basic'],
          callbackURL: `${serverBaseUrl}/auth/slack/callbackTmp`,
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
          ...slackAppConfig,
          skipUserProfile: false,
          scope: ['client'],
          callbackURL: `${serverBaseUrl}/auth/slack/callback`,
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
  applyHelmet() {
    return helmet();
  },
};
