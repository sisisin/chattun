import { createModule } from 'typeless';
import { SessionSymbol } from './symbol';

// --- Actions ---
export const [handle, SessionActions, getSessionState] = createModule(SessionSymbol)
  .withActions({
    authRequiredRoutesTransitionStarted: null,
    connectionInitialized: (payload: { userId: string; accessToken: string }) => ({
      payload,
    }),
  })
  .withState<SessionState>();

// --- Types ---
export interface SessionState {
  isConnected: boolean;
  accessToken: string | undefined;
}
