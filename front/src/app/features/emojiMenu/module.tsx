import React from 'react';
import { EmojiMenuView } from './components/EmojiMenuView';
import { EmojiMenuActions, EmojiMenuState, handle, getEmojiMenuState } from './interface';
import { getSlackClient } from 'app/services/http/SlackClient';

// --- Epic ---
handle
  .epic()
  .on(EmojiMenuActions.toggleEmojiMenu, ({ emojiMenuPosition }) => {
    const { isEmojiMenuVisible } = getEmojiMenuState();
    if (isEmojiMenuVisible) {
      return EmojiMenuActions.closeEmojiMenu();
    } else {
      return EmojiMenuActions.showEmojiMenu(emojiMenuPosition);
    }
  })
  .on(EmojiMenuActions.addReaction, async ({ message, reaction }) => {
    if (message === undefined) {
      return null;
    }

    await getSlackClient().addReaction(message.channelId, message.ts, reaction);
    return null;
  })
  .on(EmojiMenuActions.removeReaction, async ({ message, reaction }) => {
    if (message === undefined) {
      return null;
    }
    await getSlackClient().removeReaction(message.channelId, message.ts, reaction);
    return null;
  });

// --- Reducer ---
const initialState: EmojiMenuState = {
  targetMessage: undefined,
  isEmojiMenuVisible: false,
  clientX: 0,
  clientY: 0,
};

export const reducer = handle
  .reducer(initialState)
  .on(
    EmojiMenuActions.showEmojiMenu,
    (state, { emojiMenuPosition: { clientX, clientY, targetMessage } }) => {
      state.targetMessage = targetMessage;
      state.clientX = clientX;
      state.clientY = clientY;
      state.isEmojiMenuVisible = true;
    },
  )
  .onMany([EmojiMenuActions.addReaction, EmojiMenuActions.closeEmojiMenu], state => {
    state.isEmojiMenuVisible = false;
  });

// --- Module ---
export const EmojiMenuModule = () => {
  handle();
  return <EmojiMenuView />;
};
