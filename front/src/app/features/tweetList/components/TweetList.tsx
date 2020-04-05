import { Tweet } from 'app/features/timeline/interface';
import * as React from 'react';
import { TweetItem } from './tweet/Tweet';

export const TweetListView = ({ messages }: { messages: Tweet[] }) => {
  const ulistRef = React.useRef<HTMLUListElement>(null);

  return (
    <>
      {messages.length === 0 ? (
        <div className="tweetlist is-empty">
          <img src="/assets/logo_chattun_gray.svg" alt="chattun" className="tweetlist-empty-logo" />
          <p className="tweetlist-empty-text">まだ投稿がありません。</p>
        </div>
      ) : (
        <ul className="tweetlist" ref={ulistRef}>
          {messages.map((message, i) => {
            return (
              <TweetItem
                key={`${message.channelId}_${message.ts}`}
                message={message}
                parentRef={ulistRef}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};
