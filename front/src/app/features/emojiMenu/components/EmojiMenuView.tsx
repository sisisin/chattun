import { getMartEmojis } from 'app/features/slack/selector';
import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useActions, useMappedState, useSelector } from 'typeless';
import { EmojiMenuActions, getEmojiMenuState } from '../interface';

const LazyPicker = React.lazy(async () => {
  const [{ default: Picker }, { default: data }] = await Promise.all([
    import('@emoji-mart/react'),
    import('@emoji-mart/data'),
  ]);
  return {
    default: (props: { custom: any; onEmojiSelect: (emoji: { id: string }) => void }) => (
      <Picker data={data} {...props} autoFocus />
    ),
  };
});

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
        <React.Suspense fallback={null}>
          <LazyPicker
            custom={martEmojis}
            onEmojiSelect={(emoji: { id: string }) => {
              addReaction(targetMessage, emoji.id);
            }}
          />
        </React.Suspense>
      </div>
    ),
    [addReaction, clientY, martEmojis, targetMessage],
  );
  return isEmojiMenuVisible ? (
    <OutsideClickHandler onOutsideClick={closeEmojiMenu}>{picker}</OutsideClickHandler>
  ) : null;
};
