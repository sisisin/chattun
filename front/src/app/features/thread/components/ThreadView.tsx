import { Menu } from 'app/components/menu/Menu';
import { TweetListModule } from 'app/features/tweetList/module';
import { EmojiMenuModule } from 'app/features/emojiMenu/module';
import { getThreadMessages } from '../ThreadQuery';
import React from 'react';
import { useSelector } from 'typeless';

export const ThreadView = () => {
  const messages = useSelector(getThreadMessages);
  return (
    <>
      <EmojiMenuModule />
      <div>
        <Menu />
        <TweetListModule messages={messages} />
      </div>
    </>
  );
};
