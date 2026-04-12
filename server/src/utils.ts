import type { SessionData } from './session.ts';

export function getSessionProfile(session: SessionData) {
  const user = (session as any)?.slack?.user;
  if (!user) {
    return undefined;
  }

  return { accessToken: user.token as string, userId: user.id as string };
}
