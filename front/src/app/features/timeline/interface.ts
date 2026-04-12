import { createModule } from 'typeless';
import { TimelineSymbol } from './symbol';
import { DeepLinking } from 'app/types/TimelineSettings';

// --- Actions ---
export const [handle, TimelineActions, getTimelineState] = createModule(TimelineSymbol)
  .withActions({
    $mounted: null,
    $unmounting: null,
    $remounted: null,
    markFulfilled: (message: Tweet) => ({ payload: { message } }),
  })
  .withState<TimelineState>();

// --- Types ---
export interface AddReactionArgument {
  message: Tweet;
  reaction: string;
}

export interface CustomEmojiInfo {
  id: string;
  name: string;
  keywords: string[];
  skins: { src: string }[];
}

export interface Reaction {
  name: string;
  emoji: CustomEmojiInfo | undefined;
  count: number;
  reactors: string[];
  reacted: boolean;
}

export interface Tweet {
  threadTs?: string;
  ts: string;
  channelId: string;
  displayName: string;
  fullName: string;
  channelName: string;
  iconUrl: string;
  text: string;
  reactions: Reaction[];
  slackLink: {
    type: DeepLinking;
    link: string | undefined;
  };
  edited?: {
    ts: string;
  };
  updatedAt: number;
}

export interface TimelineState {}
