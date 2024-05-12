import morganLogger from 'morgan';
import * as lw from '@google-cloud/logging-winston';
import winston from 'winston';

let logFormat: 'gcp' | 'local' = (process.env.LOG_FORMAT as 'local' | 'gcp') ?? 'gcp';
export let logger: winston.Logger;

export function initializeLogger() {
  const transports: winston.transport[] = [];
  switch (logFormat) {
    case 'gcp': {
      const loggingWinston = new lw.LoggingWinston({
        projectId: process.env.PROJECT_ID,
      });
      transports.push(loggingWinston);
      break;
    }

    case 'local': {
      transports.push(new winston.transports.Console());
      break;
    }
    default:
  }

  logger = winston.createLogger({ level: 'info', transports });
  logger.info('log format is set', { logFormat });
}
import express from 'express';

export async function configureLoggingMiddleware(app: express.Express) {
  switch (logFormat) {
    case 'gcp': {
      app.use(await lw.express.makeMiddleware(logger));
      break;
    }
    case 'local': {
      app.use(morganLogger('dev'));
    }
  }
}
