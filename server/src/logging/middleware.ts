import type express from 'express';
import { logger } from './logger.ts';

export const loggingMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  logger.withRequestContext(req, () => {
    next();
  });
};
