import { useRouter } from 'app/hooks/useRouter';
import { slackClient } from 'app/services/http/SlackClient';
import React from 'react';
import { useActions } from 'typeless';
import { SlackActions } from '../slack/interface';
import { ThreadView } from './components/ThreadView';
import { handle, ThreadActions, ThreadParam, ThreadState } from './interface';

// --- Epic ---
handle.epic().on(ThreadActions.mounted, async ({ channelId, ts }) => {
  const res = await slackClient.repliesConversations(channelId, ts);
  return SlackActions.mergeMessages(res.messages);
});

// --- Reducer ---
const initialState: ThreadState = {
  channelId: null,
  ts: null,
};

export const reducer = handle
  .reducer(initialState)
  .on(ThreadActions.mounted, (state, { ts, channelId }) => {
    state.channelId = channelId;
    state.ts = ts;
  });

// --- Module ---
export const ThreadModule = () => {
  handle();
  const { params } = useRouter<ThreadParam>();
  const { mounted: fetchThreadMessages } = useActions(ThreadActions);
  React.useEffect(() => {
    fetchThreadMessages(params);
  }, [fetchThreadMessages, params]);
  return <ThreadView />;
};
