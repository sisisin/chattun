const { isProduction } = require('./env');
// const isProduction = true;
const serverBasePath = isProduction
  ? process.env.SERVER_BASE_URL
  : 'http://localhost:3100';

const frontBasePath = isProduction ? process.env.FRONT_BASE_URL : 'http://localhost:3000';
const frontBasePathSecondary = process.env.FRONT_BASE_URL_SECONDARY;

const redisConfig = process.env.REDIS_URL;

function getSessionConfig(redisStore) {
  return {
    store: redisStore,
    name: 'connect.sid',
    secret: 'abkl;aew',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      path: '/',
      sameSite: 'none'
    },
  };
}

module.exports = { serverBasePath, frontBasePath, frontBasePathSecondary, redisConfig, getSessionConfig };
