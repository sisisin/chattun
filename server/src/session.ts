import crypto from 'node:crypto';
import type { MiddlewareHandler } from 'hono';
import { redis } from './redis.ts';

const SESSION_COOKIE = 'sid';
const SESSION_PREFIX = 'sess:';
const SESSION_TTL = 60 * 60 * 24 * 5; // 5 days

export type SessionData = Record<string, unknown>;

export function createSessionId(): string {
  return crypto.randomUUID();
}

function parseSessionIdFromCookie(cookieHeader: string | undefined): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match?.[1];
}

export async function loadSession(sessionId: string): Promise<SessionData> {
  const data = await redis.get(SESSION_PREFIX + sessionId);
  return data ? JSON.parse(data) : {};
}

export async function saveSession(sessionId: string, data: SessionData): Promise<void> {
  await redis.set(SESSION_PREFIX + sessionId, JSON.stringify(data), 'EX', SESSION_TTL);
}

export async function loadSessionFromCookieHeader(
  cookieHeader: string | undefined,
): Promise<{ sessionId: string | undefined; data: SessionData }> {
  const sessionId = parseSessionIdFromCookie(cookieHeader);
  if (!sessionId) return { sessionId: undefined, data: {} };
  const data = await loadSession(sessionId);
  return { sessionId, data };
}

export const sessionMiddleware: MiddlewareHandler = async (c, next) => {
  const sessionId = parseSessionIdFromCookie(c.req.header('cookie'));
  let session: SessionData = {};

  if (sessionId) {
    session = await loadSession(sessionId);
  }

  c.set('session', session);
  c.set('sessionId', sessionId);

  await next();
};

export function serializeSessionCookie(sessionId: string): string {
  return `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL}`;
}
