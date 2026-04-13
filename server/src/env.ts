import type { HttpBindings } from '@hono/node-server';
import type { SessionData } from './session.ts';

export type Env = {
  Bindings: HttpBindings;
  Variables: {
    session: SessionData;
    sessionId: string | undefined;
  };
};
