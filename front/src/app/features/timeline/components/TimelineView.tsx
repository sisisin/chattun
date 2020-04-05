import { Menu } from 'app/components/menu/Menu';
import { EmojiMenuModule } from 'app/features/emojiMenu/module';
import { TweetListModule } from 'app/features/tweetList/module';
import React from 'react';
import { useSelector } from 'typeless';
import { getTimelineMessages } from '../TimelineQuery';

export const TimelineView = () => {
  const messages = useSelector(getTimelineMessages);

  return (
    <>
      <EmojiMenuModule />
      <div className="timeline menu-parent">
        <Menu />
        <TweetListModule messages={messages} />
      </div>
    </>
  );
};
