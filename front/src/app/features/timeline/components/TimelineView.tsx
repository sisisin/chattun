import './TimelineView.css';
import { Menu } from 'app/components/menu/Menu';
import { EmojiMenuModule } from 'app/features/emojiMenu/module';
import { getGlobalSettingState } from 'app/features/globalSetting/interface';
import { Tweet } from './tweet/module';
import React from 'react';
import { useMappedState, useSelector } from 'typeless';
import { getTimelineMessages } from '../selector';

export const TimelineView = () => {
  const messages = useSelector(getTimelineMessages);
  const ulistRef = React.useRef<HTMLUListElement>(null);
  const { mutedUsers } = useMappedState([getGlobalSettingState], s => s);

  return (
    <>
      <EmojiMenuModule />
      <div className="timeline menu-parent">
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
