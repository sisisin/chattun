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
      secure: true,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
    },
  });
};

// todo: ちゃんとする
export const makeHelmet = () => helmet({ contentSecurityPolicy: false });
