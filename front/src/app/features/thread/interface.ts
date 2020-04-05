import { createModule } from 'typeless';
import { ThreadSymbol } from './symbol';

// --- Actions ---
export const [handle, ThreadActions, getThreadState] = createModule(ThreadSymbol)
  .withActions({
    mounted: (arg: ThreadParam) => ({ payload: { ...arg } }),
  })
  .withState<ThreadState>();

// --- Types ---
export interface ThreadParam {
  channelId: string;
  ts: string;
}

export interface ThreadState {
  channelId: string | null;
  ts: string | null;
}
