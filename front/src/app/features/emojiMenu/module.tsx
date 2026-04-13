import React from 'react';
import { EmojiMenuView } from './components/EmojiMenuView';
import { EmojiMenuActions, EmojiMenuState, handle, getEmojiMenuState } from './interface';
import { slackClient } from 'app/services/http/SlackClient';
import { getSlackState, SlackActions } from 'app/features/slack/interface';
import { appRegistry } from 'app/services/AppRegistry';

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
    const reactionEvent = {
      type: 'reaction_added' as const,
      user: profile.userId,
      reaction,
      item: { type: 'message' as const, channel: message.channelId, ts: message.ts },
      event_ts: now,
      ts: now,
    };
    appRegistry.dispatch(SlackActions.onReactionAdded(reactionEvent));

    try {
      await slackClient.addReaction(message.channelId, message.ts, reaction);
    } catch {
      appRegistry.dispatch(
        SlackActions.onReactionRemoved({ ...reactionEvent, type: 'reaction_removed' }),
      );
    }
    return null;
  })
  .on(EmojiMenuActions.removeReaction, async ({ message, reaction }) => {
    if (message === undefined) {
      return null;
    }

    const { profile } = getSlackState();
    const now = String(Date.now() / 1000);
    const reactionEvent = {
      type: 'reaction_removed' as const,
      user: profile.userId,
      reaction,
      item: { type: 'message' as const, channel: message.channelId, ts: message.ts },
      event_ts: now,
      ts: now,
    };
    appRegistry.dispatch(SlackActions.onReactionRemoved(reactionEvent));

    try {
      await slackClient.removeReaction(message.channelId, message.ts, reaction);
    } catch {
      appRegistry.dispatch(
        SlackActions.onReactionAdded({ ...reactionEvent, type: 'reaction_added' }),
      );
    }
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
