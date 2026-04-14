import { createModule } from 'typeless';
import { ChannelSymbol } from './symbol';

// --- Actions ---
export const [handle, ChannelActions, getChannelState] = createModule(ChannelSymbol)
  .withActions({
    mounted: (arg: ChannelParam) => ({ payload: { ...arg } }),
  })
  .withState<ChannelState>();

// --- Types ---
export interface ChannelParam {
  channelId: string;
}

export interface ChannelState {
  channelId: string | null;
}
