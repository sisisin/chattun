const port = process.env.PORT;
const slackClientId = process.env.CLIENT_ID!;
const slackClientSecret = process.env.CLIENT_SECRET!;
const slackAppToken = process.env.SLACK_APP_TOKEN!;

const serverBaseUrl = process.env.SERVER_BASE_URL ?? 'https://localhost:3000';
const redisConfig = process.env.REDIS_URL;

export { port, slackClientId, slackClientSecret, slackAppToken, serverBaseUrl, redisConfig };
