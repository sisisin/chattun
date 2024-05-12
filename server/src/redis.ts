import Redis from 'ioredis';
import { redisConfig } from './config';
import { createAdapter } from '@socket.io/redis-adapter';

export const redis = new Redis(redisConfig);
const pubClient = redis.duplicate();
const subClient = redis.duplicate();

export const createIOAdapter = () => {
  return createAdapter(pubClient, subClient);
};
