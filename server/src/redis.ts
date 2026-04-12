import Redis from 'ioredis';
import { redisConfig } from './config.ts';
import socketIoRedisAdapter from '@socket.io/redis-adapter';
const { createAdapter } = socketIoRedisAdapter;

export const redis = new Redis(redisConfig);
const pubClient = redis.duplicate();
const subClient = redis.duplicate();

export const createIOAdapter = () => {
  return createAdapter(pubClient, subClient);
};
