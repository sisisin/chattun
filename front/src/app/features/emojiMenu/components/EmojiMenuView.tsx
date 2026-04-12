import { getMartEmojis } from 'app/features/slack/SlackQuery';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useActions, useMappedState, useSelector } from 'typeless';
import { EmojiMenuActions, getEmojiMenuState } from '../interface';

export const EmojiMenuView = () => {
  const martEmojis = useSelector(getMartEmojis);
  const { clientY, isEmojiMenuVisible, targetMessage } = useMappedState(
    [getEmojiMenuState],
    ({ clientY, isEmojiMenuVisible, targetMessage }) => {
      return { martEmojis, clientY, isEmojiMenuVisible, targetMessage };
    },
  );
  const { addReaction, closeEmojiMenu } = useActions(EmojiMenuActions);
  const picker = React.useMemo(
    () => (
      <div style={{ position: 'absolute', zIndex: 1, top: `${clientY + 15}px` }}>
        <Picker
          data={data}
          custom={martEmojis}
          onEmojiSelect={(emoji: { id: string }) => {
            addReaction(targetMessage, emoji.id);
          }}
          autoFocus
        />
      </div>
    ),
    [addReaction, clientY, martEmojis, targetMessage],
  );
  return isEmojiMenuVisible ? (
    <OutsideClickHandler onOutsideClick={closeEmojiMenu}>{picker}</OutsideClickHandler>
  ) : null;
};
