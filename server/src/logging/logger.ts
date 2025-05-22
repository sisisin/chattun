import type express from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { extractTrace } from './trace';
import { LogLevel } from '@slack/oauth';

const severities = ['DEFAULT', 'DEBUG', 'INFO', 'WARNING', 'WARN', 'ERROR', 'EMERGENCY'] as const;
type Severity = (typeof severities)[number];

const SEVERITY_SCORE: Record<Severity, number> = {
  DEFAULT: 0,
  DEBUG: 100,
  INFO: 200,
  WARNING: 400,
  WARN: 400,
  ERROR: 500,
  EMERGENCY: 800,
};

let LOGLEVEL = (() => {
  const fromEnv = process.env.LOGLEVEL;
  if (fromEnv === undefined) {
    return 'INFO';
  }
  if (severities.includes(fromEnv as Severity)) {
    return fromEnv as Severity;
  }
  return 'DEFAULT';
})();

/**
 * NOTE: Applicationレイヤーで利用しないこと
 * このクラスは、AsyncLocalStorageのレコードを大域脱出したときにも保持する用途で利用します（主にhttp handlerのエラーのcatch内などで利用）
 */
export class ErrorWithLogContext extends Error {
  context: Record<string, unknown>;
  constructor(context: Record<string, unknown>, cause: unknown) {
    super();
    this.context = context;
    this.cause = cause;
  }

  /**
   * このクラスはエラーとしての情報を持たないので、ログ出力時に剥がすのにこのメソッドを利用する
   * NOTE: withContextをcatchして別のエラークラスでwrapしたケースには対応していない
   */
  unwrapAndGetContext(): [Record<string, unknown>, unknown] {
    let cause: unknown = this.cause;
    let context: Record<string, unknown> = this.context;
    for (;;) {
      if (cause instanceof Error) {
        if (cause instanceof ErrorWithLogContext) {
          context = { ...context, ...cause.context };
          cause = cause.cause;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return [context, cause];
  }
}

const loggingContext = new AsyncLocalStorage<Record<string, unknown>>();
export const logger = {
  info: (message: string, data: Record<string, unknown> = {}): void => {
    log('INFO', message, data);
  },
  infoe: (message: string, err: unknown, data: Record<string, unknown> = {}): void => {
    log('INFO', message, { ...data, error: errorToLogObject(err) });
  },
  warn: (message: string, data: Record<string, unknown> = {}): void => {
    log('WARNING', message, data);
  },
  error: (message: string, data: Record<string, unknown> = {}): void => {
    log('ERROR', message, data);
  },
  errore: (message: string, err: unknown, data: Record<string, unknown> = {}): void => {
    log('ERROR', message, { ...data, error: errorToLogObject(err) });
  },
  withContext: <T>(context: Record<string, unknown>, fn: () => Promise<T>): Promise<T> => {
    const store = loggingContext.getStore() ?? {};
    return loggingContext.run({ ...store, ...context }, async () => {
      return Promise.resolve()
        .then(fn)
        .catch((err) => {
          throw new ErrorWithLogContext(loggingContext.getStore() ?? {}, err);
        });
    });
  },
  withRequestContext: <T>(req: express.Request, fn: () => T): T => {
    const context = extractLogDataFromRequest(req);
    return loggingContext.run(context, fn);
  },
};

export const slackLogger = {
  debug(...msgs: unknown[]) {
    logger.info(`slack log - ${msgs[0] as string}`, { msgs });
  },
  info(...msgs: unknown[]) {
    logger.info(`slack log - ${msgs[0] as string}`, { msgs });
  },
  warn(...msgs: unknown[]) {
    logger.warn(`slack log - ${msgs[0] as string}`, { msgs });
  },
  error(...msgs: unknown[]) {
    logger.error(`slack log - ${msgs[0] as string}`, { msgs });
  },
  getLevel() {
    switch (LOGLEVEL) {
      case 'DEBUG':
        return LogLevel.DEBUG;
      case 'INFO':
        return LogLevel.INFO;
      case 'WARNING':
      case 'WARN':
        return LogLevel.WARN;
      case 'ERROR':
        return LogLevel.ERROR;
      default:
        return LogLevel.INFO;
    }
  },
  setLevel(level: LogLevel) {
    switch (level) {
      case LogLevel.DEBUG:
        LOGLEVEL = 'DEBUG';
      case LogLevel.INFO:
        LOGLEVEL = 'INFO';
      case LogLevel.WARN:
        LOGLEVEL = 'WARNING';
      case LogLevel.ERROR:
        LOGLEVEL = 'ERROR';
      default:
        LOGLEVEL = 'INFO';
    }
  },
  setName(name: string) {
    // noop
  },
};

function errorToLogObject(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    const obj: Record<string, unknown> = {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
    if (err.cause) {
      obj.cause = errorToLogObject(err.cause);
    }
    for (const [key, value] of Object.entries(err)) {
      if (Object.prototype.hasOwnProperty.call(err, key) && !obj[key]) {
        obj[key] = value;
      }
    }
    return obj;
  }
  return {
    message: String(err),
  };
}

/**
 * 規定のLogEntryに入れるデータを抽出する
 * LogEntryの仕様はこちら: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
 */
function extractLogDataFromRequest(req: express.Request): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  const traceMeta = getTraceMeta(req);

  return {
    ...obj,
    ...traceMeta,
  };
}

function getTraceMeta(req: express.Request): object {
  const trace = extractTrace(req);

  return trace
    ? {
        'logging.googleapis.com/trace': trace.traceId,
        'logging.googleapis.com/spanId': trace.parentId,
        'logging.googleapis.com/trace_sampled': trace.isSampled,
      }
    : {};
}
function log(severity: Severity, message: string, additional: object = {}): void {
  if (SEVERITY_SCORE[severity] < SEVERITY_SCORE[LOGLEVEL]) {
    return;
  }

  const context = loggingContext.getStore() ?? {};
  const payload = {
    message,
    severity,
    ...context,
    ...additional,
  };

  // deno-lint-ignore no-console
  console.log(JSON.stringify(payload));
}
