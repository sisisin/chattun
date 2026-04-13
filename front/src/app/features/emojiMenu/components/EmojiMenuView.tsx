import { getMartEmojis } from 'app/features/slack/selector';
import React from 'react';
import { useActions, useMappedState, useSelector } from 'typeless';
import { EmojiMenuActions, getEmojiMenuState } from '../interface';

const LazyPicker = React.lazy(async () => {
  const { default: Picker } = await import('@emoji-mart/react');
  return {
    default: (props: { custom: any; onEmojiSelect: (emoji: { id: string }) => void }) => (
      <Picker {...props} autoFocus />
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
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isEmojiMenuVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeEmojiMenu();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeEmojiMenu();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEmojiMenuVisible, closeEmojiMenu]);

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
  return isEmojiMenuVisible ? <div ref={containerRef}>{picker}</div> : null;
};
