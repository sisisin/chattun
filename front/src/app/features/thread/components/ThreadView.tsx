import { Menu } from 'app/components/menu/Menu';
import { EmojiMenuModule } from 'app/features/emojiMenu/module';
import { Tweet } from 'app/features/timeline/components/tweet/module';
import { getThreadMessages } from '../selector';
import React from 'react';
import { useSelector } from 'typeless';

export const ThreadView = () => {
  const messages = useSelector(getThreadMessages);
  const ulistRef = React.useRef<HTMLUListElement>(null);

  return (
    <>
      <EmojiMenuModule />
      <div>
        <Menu />
        {messages.length === 0 ? (
          <div className="tweetlist is-empty">
            <img
              src="/assets/logo_chattun_gray.svg"
              alt="chattun"
              className="tweetlist-empty-logo"
            />
            <p className="tweetlist-empty-text">まだ投稿がありません。</p>
          </div>
        ) : (
          <ul className="tweetlist" ref={ulistRef}>
            {messages.map(message => (
              <Tweet
                key={`${message.channelId}_${message.ts}`}
                message={message}
                parentRef={ulistRef}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
