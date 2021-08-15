// const isProduction = true;
const isProduction = process.env.NODE_ENV === 'production';

const serverBaseUrl = process.env.SERVER_BASE_URL || 'http://localhost:3100';

/**
 * 開発時はcreate-react-appを利用するので、front向けのURLを分ける必要がある
 * デフォルトはcraの起動ポート3000を使うようにしておく
 */
const frontBaseUrl = isProduction ? serverBaseUrl : process.env.FRONT_BASE_URL_DEV || 'http://localhost:3000';

const redisConfig = process.env.REDIS_URL;

const slackAppConfig = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};
module.exports = { serverBaseUrl, frontBaseUrl, redisConfig, isProduction, slackAppConfig };
