import React from 'react';
import { EmojiMenuView } from './components/EmojiMenuView';
import { EmojiMenuActions, EmojiMenuState, handle, getEmojiMenuState } from './interface';
import { slackClient } from 'app/services/http/SlackClient';
import { getSlackState, SlackActions } from 'app/features/slack/interface';

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

    const { profile } = getSlackState();
    const now = String(Date.now() / 1000);
    SlackActions.onReactionAdded({
      type: 'reaction_added',
      user: profile.userId,
      reaction,
      item: { type: 'message', channel: message.channelId, ts: message.ts },
      event_ts: now,
      ts: now,
    });

    await slackClient.addReaction(message.channelId, message.ts, reaction);
    return null;
  })
  .on(EmojiMenuActions.removeReaction, async ({ message, reaction }) => {
    if (message === undefined) {
      return null;
    }

    const { profile } = getSlackState();
    const now = String(Date.now() / 1000);
    SlackActions.onReactionRemoved({
      type: 'reaction_removed',
      user: profile.userId,
      reaction,
      item: { type: 'message', channel: message.channelId, ts: message.ts },
      event_ts: now,
      ts: now,
    });

    await slackClient.removeReaction(message.channelId, message.ts, reaction);
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
