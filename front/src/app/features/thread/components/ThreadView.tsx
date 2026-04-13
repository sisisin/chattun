import { Menu } from 'app/components/menu/Menu';
import { EmojiMenuModule } from 'app/features/emojiMenu/module';
import { ResolveContextProvider } from 'app/features/mrkdwn/ResolveContext';
import { Tweet } from 'app/features/timeline/components/tweet/module';
import styles from 'app/features/timeline/components/TimelineView.module.css';
import { getThreadMessages } from '../selector';
import React from 'react';
import { useSelector } from 'typeless';

export const ThreadView = () => {
  const messages = useSelector(getThreadMessages);
  const ulistRef = React.useRef<HTMLUListElement>(null);

  return (
    <>
      <EmojiMenuModule />
      <ResolveContextProvider>
        <div className={styles.menuParent}>
          <Menu />
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
                  inThread
                />
              ))}
            </ul>
          )}
        </div>
      </ResolveContextProvider>
    </>
  );
};
