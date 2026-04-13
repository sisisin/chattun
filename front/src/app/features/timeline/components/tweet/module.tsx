import { getSlackState } from 'app/features/slack/interface';
import { Tweet } from 'app/features/timeline/interface';
import React from 'react';
import { TweetView } from './components/TweetView';
import { handle, TweetActions } from './interface';

// --- Epic ---
handle.epic().on(TweetActions.copyClicked, ({ msg }) => {
  const { messagesByChannel } = getSlackState();
  if (navigator.clipboard) {
    const row = messagesByChannel[msg.channelId]?.[msg.ts];
    navigator.clipboard.writeText(JSON.stringify({ row, proced: msg }));
  }

  return null;
});

// --- Module ---
interface TweetItemProps {
  message: Tweet;
  parentRef: React.RefObject<HTMLUListElement>;
}

export const TweetItem = ({ message, parentRef }: TweetItemProps) => {
  handle();
  return <TweetView message={message} parentRef={parentRef} />;
};
