import { Menu } from 'app/components/menu/Menu';
import { EmojiMenuModule } from 'app/features/emojiMenu/module';
import { TweetListModule } from 'app/features/tweetList/module';
import React from 'react';
import { useSelector } from 'typeless';
import { getTimelineMessages } from '../TimelineQuery';

export const TimelineView = () => {
  const messages = useSelector(getTimelineMessages);
  const tlStyles = {
    gridTemplateRows: 'auto',
    gridTemplateColumns: '1fr 1fr',
  };
  return (
    <>
      <EmojiMenuModule />
      <div className="timeline menu-parent">
        <Menu />
        <div className="tweet-list-container" style={tlStyles}>
          <TweetListModule messages={messages} />
          <TweetListModule messages={messages} />
          {/* <TweetListModule messages={messages} />
          <TweetListModule messages={messages} /> */}
        </div>
      </div>
    </>
  );
};
