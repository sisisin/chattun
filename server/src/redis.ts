import Redis from 'ioredis';
import { redisConfig } from './config';

export const redis = new Redis(redisConfig);
