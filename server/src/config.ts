const isProduction = process.env.NODE_ENV === 'production';
const useHttp = isProduction || process.env.USE_HTTP === 'true';

const privateKeyPath = process.env.PRIV_KEY!;
const certPath = process.env.CERT!;
const port = process.env.PORT;
const slackClientId = process.env.CLIENT_ID!;
const slackClientSecret = process.env.CLIENT_SECRET!;
const slackAppToken = process.env.SLACK_APP_TOKEN!;

const serverBaseUrl = process.env.SERVER_BASE_URL!;
/**
 * 開発時はcreate-react-appを利用するので、front向けのURLを分ける必要がある
 * デフォルトはcraの起動ポート3000を使うようにしておく
 */
const frontBaseUrl = isProduction ? serverBaseUrl : process.env.FRONT_BASE_URL_DEV || 'http://localhost:3000';
const redisConfig = process.env.REDIS_URL;

export {
  useHttp,
  privateKeyPath,
  certPath,
  port,
  slackClientId,
  slackClientSecret,
  slackAppToken,
  serverBaseUrl,
  frontBaseUrl,
  redisConfig,
};
