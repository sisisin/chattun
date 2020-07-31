import { Tweet } from 'app/features/timeline/interface';
import * as React from 'react';
import { TweetItem } from './tweet/Tweet';
import { useMappedState } from 'typeless';
import { getGlobalSettingState } from 'app/features/globalSetting/interface';

export const TweetListView = ({ messages }: { messages: Tweet[] }) => {
  const ulistRef = React.useRef<HTMLUListElement>(null);
  const { keywordMatch } = useMappedState([getGlobalSettingState], s => s);

  return (
    <>
      {messages.length === 0 ? (
        <div className="tweetlist is-empty">
          <img src="/assets/logo_chattun_gray.svg" alt="chattun" className="tweetlist-empty-logo" />
          <p className="tweetlist-empty-text">まだ投稿がありません。</p>
        </div>
      ) : (
        <ul className="tweetlist" ref={ulistRef}>
          {messages
            .filter((message, i) => {
              if (keywordMatch?.matchMethod === 'notContain' && keywordMatch?.matchValue !== '') {
                return (
                  !message.displayName.includes(keywordMatch?.matchValue) &&
                  !message.fullName.includes(keywordMatch?.matchValue) &&
                  !message.text.includes(keywordMatch?.matchValue)
                );
              }
              return true;
            })
            .map((message, i) => {
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
