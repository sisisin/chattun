import { createModule } from 'typeless';
import { TimelineSymbol } from './symbol';
import { DeepLinking } from 'app/types/TimelineSettings';
import { BlockKit } from 'app/types/slack';

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

export interface FileAttachment {
  thumb360: string;
  urlPrivate: string;
}

export interface ImageAttachment {
  fallback: string;
  imageUrl: string;
}

export interface TextAttachment {
  text?: string;
  pretext?: string;
  title?: string;
  titleLink?: string;
  authorName?: string;
  authorIcon?: string;
  footer?: string;
  color?: string;
  imageUrl?: string;
  files?: FileAttachment[];
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
  files: FileAttachment[];
  imageAttachments: ImageAttachment[];
  reactions: Reaction[];
  slackLink: {
    type: DeepLinking;
    link: string | undefined;
  };
  edited?: {
    ts: string;
  };
  textAttachments: TextAttachment[];
  isHuddle: boolean;
  blocks?: BlockKit.RichTextBlock[];
  updatedAt: number;
}

export interface TimelineState {}
