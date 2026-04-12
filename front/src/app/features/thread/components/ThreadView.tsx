import { Menu } from 'app/components/menu/Menu';
import { EmojiMenuModule } from 'app/features/emojiMenu/module';
import { getGlobalSettingState } from 'app/features/globalSetting/interface';
import { TweetItem } from 'app/features/timeline/components/tweet/components/Tweet';
import { useTweetModule } from 'app/features/timeline/components/tweet/module';
import { getThreadMessages } from '../selector';
import React from 'react';
import { useMappedState, useSelector } from 'typeless';

export const ThreadView = () => {
  useTweetModule();
  const messages = useSelector(getThreadMessages);
  const ulistRef = React.useRef<HTMLUListElement>(null);
  const { mutedUsers } = useMappedState([getGlobalSettingState], s => s);

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
            {messages
              .filter(message => {
                if (mutedUsers.length === 0) return true;
                return !mutedUsers.some(
                  muted =>
                    muted !== '' &&
                    (message.displayName.includes(muted) || message.fullName.includes(muted)),
                );
              })
              .map(message => (
                <TweetItem
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
