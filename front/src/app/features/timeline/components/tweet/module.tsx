import { getSlackState } from 'app/features/slack/interface';
import { handle, TweetActions } from './interface';

handle.epic().on(TweetActions.copyClicked, ({ msg }) => {
  const { messagesByChannel } = getSlackState();
  if (navigator.clipboard) {
    const row = messagesByChannel[msg.channelId]?.[msg.ts];
    navigator.clipboard.writeText(JSON.stringify({ row, proced: msg }));
  }

  return null;
});

export function useTweetModule() {
  handle();
}
