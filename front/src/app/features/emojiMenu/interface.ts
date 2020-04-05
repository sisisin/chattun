import { createModule } from 'typeless';
import { Tweet } from '../timeline/interface';
import { EmojiMenuSymbol } from './symbol';

// --- Actions ---
export const [handle, EmojiMenuActions, getEmojiMenuState] = createModule(EmojiMenuSymbol)
  .withActions({
    toggleEmojiMenu: (emojiMenuPosition: EmojiMenuPosition) => ({ payload: { emojiMenuPosition } }),
    showEmojiMenu: (emojiMenuPosition: EmojiMenuPosition) => ({ payload: { emojiMenuPosition } }),
    closeEmojiMenu: null,
    addReaction: (message: Tweet | undefined, reaction: string) => ({
      payload: { reaction, message },
    }),
    removeReaction: (message: Tweet | undefined, reaction: string) => ({
      payload: { reaction, message },
    }),
  })
  .withState<EmojiMenuState>();

// --- Types ---
export interface EmojiMenuPosition {
  targetMessage?: Tweet;
  clientX: number;
  clientY: number;
}

export interface EmojiMenuState extends EmojiMenuPosition {
  isEmojiMenuVisible: boolean;
}
