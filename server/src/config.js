// const isProduction = true;
const isProduction = process.env.NODE_ENV === 'production';

const serverBasePath = isProduction
  ? process.env.SERVER_BASE_URL
  : 'http://localhost:3100';

const frontBasePath = isProduction ? process.env.FRONT_BASE_URL : 'http://localhost:3000';
const frontBasePathSecondary = process.env.FRONT_BASE_URL_SECONDARY;

const redisConfig = process.env.REDIS_URL;


module.exports = { serverBasePath, frontBasePath, frontBasePathSecondary, redisConfig };
