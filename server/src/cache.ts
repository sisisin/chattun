import { logger } from './logging/logger.ts';
import { redis } from './redis.ts';

const CACHE_TTL = 300; // 5 minutes
const KEY_PREFIX = 'cache:';

export async function getOrFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  try {
    const cached = await redis.get(KEY_PREFIX + key);
    if (cached !== null) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    logger.errore('Cache read failed, falling back to fetcher', err);
  }
  const result = await fetcher();
  try {
    await redis.set(KEY_PREFIX + key, JSON.stringify(result), 'EX', CACHE_TTL);
  } catch (err) {
    logger.errore('Cache write failed', err);
  }
  return result;
}
