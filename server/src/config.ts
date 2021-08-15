const useHttp = process.env.NODE_ENV === 'production' || process.env.USE_HTTP === 'true';

const privateKeyPath = process.env.PRIV_KEY!;
const certPath = process.env.CERT!;
const port = process.env.PORT;
const slackClientId = process.env.CLIENT_ID!;
const slackClientSecret = process.env.CLIENT_SECRET!;
const slackAppToken = process.env.SLACK_APP_TOKEN!;

export { useHttp, privateKeyPath, certPath, port, slackClientId, slackClientSecret, slackAppToken };
