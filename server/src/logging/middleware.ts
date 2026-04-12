import type { MiddlewareHandler } from 'hono';
import { logger } from './logger.ts';

export const loggingMiddleware: MiddlewareHandler = (c, next) => {
  return logger.withRequestContext(c.req, () => next());
};
