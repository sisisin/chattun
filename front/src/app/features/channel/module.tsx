import { useRouter } from 'app/hooks/useRouter';
import React from 'react';
import { useActions } from 'typeless';
import { ChannelView } from './components/ChannelView';
import { handle, ChannelActions, ChannelParam, ChannelState } from './interface';

// --- Reducer ---
const initialState: ChannelState = {
  channelId: null,
};

export const reducer = handle
  .reducer(initialState)
  .on(ChannelActions.mounted, (state, { channelId }) => {
    state.channelId = channelId;
  });

// --- Module ---
export const ChannelModule = () => {
  handle();
  const { params } = useRouter<ChannelParam>();
  const { mounted } = useActions(ChannelActions);
  const { channelId } = params;
  React.useEffect(() => {
    mounted({ channelId });
  }, [mounted, channelId]);
  return <ChannelView />;
};
