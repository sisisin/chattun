import { getMartEmojis } from 'app/features/slack/SlackQuery';
import { EmojiData, Picker } from 'emoji-mart';
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
      <Picker
        custom={martEmojis}
        onSelect={(emoji: EmojiData) => {
          addReaction(targetMessage, emoji.id!);
        }}
        autoFocus
        style={{
          top: `${clientY + 15}px`,
        }}
      />
    ),
    [addReaction, clientY, martEmojis, targetMessage],
  );
  return isEmojiMenuVisible ? (
    <OutsideClickHandler onOutsideClick={closeEmojiMenu}>{picker}</OutsideClickHandler>
  ) : null;
};
