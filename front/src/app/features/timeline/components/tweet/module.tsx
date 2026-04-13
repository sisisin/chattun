import { getSlackState } from 'app/features/slack/interface';
import type { Tweet as TweetData } from 'app/features/timeline/interface';
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
interface TweetProps {
  message: TweetData;
  parentRef: React.RefObject<HTMLUListElement>;
  inThread?: boolean;
}

export const Tweet = ({ message, parentRef, inThread }: TweetProps) => {
  handle();
  return <TweetView message={message} parentRef={parentRef} inThread={inThread} />;
};
