import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import helmet from 'helmet';

const RedisStore = connectRedis(session);
const redisStore = new RedisStore({ client: redis, ttl: 86400 });

export const makeSession = () => {
  return session({
    store: redisStore,
    name: 'connect.sid',
    secret: 'abkl;aew',
    resave: false,
    saveUninitialized: false,
    cookie: {
      // todo: for localhost
      secure: true,
      httpOnly: true,
      path: '/',
      sameSite: 'none',
    },
  });
};
export const applyHelmet = () => helmet({ contentSecurityPolicy: false });
