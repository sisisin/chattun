import { Menu } from 'app/components/menu/Menu';
import { EmojiMenuModule } from 'app/features/emojiMenu/module';
import { ResolveContextProvider } from 'app/features/mrkdwn/ResolveContext';
import { Tweet } from 'app/features/timeline/components/tweet/module';
import { getChannelDisplayName, getChannelMessages } from '../selector';
import React from 'react';
import { useSelector } from 'typeless';
import styles from './ChannelView.module.css';

export const ChannelView = () => {
  const messages = useSelector(getChannelMessages);
  const channelName = useSelector(getChannelDisplayName);
  const ulistRef = React.useRef<HTMLUListElement>(null);

  return (
    <>
      <EmojiMenuModule />
      <ResolveContextProvider>
        <div>
          <Menu />
          <h2 className={styles.channelHeader}>{channelName}</h2>
          {messages.length === 0 ? (
            <div className={styles.tweetlistEmpty}>
              <img
                src="/assets/logo_chattun_gray.svg"
                alt="chattun"
                className={styles.tweetlistEmptyLogo}
              />
              <p className={styles.tweetlistEmptyText}>まだ投稿がありません。</p>
            </div>
          ) : (
            <ul className={styles.tweetlist} ref={ulistRef}>
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
      </ResolveContextProvider>
    </>
  );
};
