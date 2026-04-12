import { redis } from './redis.ts';

const CACHE_TTL = 300; // 5 minutes
const KEY_PREFIX = 'cache:';

export async function getOrFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = await redis.get(KEY_PREFIX + key);
  if (cached !== null) {
    return JSON.parse(cached) as T;
  }
  const result = await fetcher();
  await redis.set(KEY_PREFIX + key, JSON.stringify(result), 'EX', CACHE_TTL);
  return result;
}
