import { Link } from '@tanstack/react-router';
import { IconArrow, IconSetting } from 'app/components/icons/Icons';
import { getSlackState } from 'app/features/slack/interface';
import { useRouter } from 'app/hooks/useRouter';
import * as React from 'react';
import { useMappedState } from 'typeless';
import styles from './Menu.module.css';

export const Menu: React.FC = () => {
  const { location, params } = useRouter<{ channelId?: string }>();
  const isTimeline = location.pathname === '/';
  const isSetting = location.pathname === '/setting';
  const isThread = location.pathname.startsWith('/thread/');
  const isChannel = location.pathname.startsWith('/channel/');

  const { channels } = useMappedState([getSlackState], s => ({ channels: s.channels }));

  const getHeaderTitle = () => {
    if (isSetting) return '設定';
    if (isThread) return 'スレッド';
    if (isChannel && params.channelId) {
      const channel = channels[params.channelId];
      return channel ? `#${channel.name}` : `#${params.channelId}`;
    }
    return 'すべての投稿';
  };
  const headerTitle = getHeaderTitle();

  return (
    <ul className={styles.menu}>
      <li className={styles.menuGoback}>
        <Link to="/" className={styles.menuGobackLink}>
          {!isTimeline && (
            <span>
              <IconArrow className={styles.menuGobackLinkItemIcon} />
              <span>戻る</span>
            </span>
          )}
        </Link>
      </li>
      <li className={styles.menuTimeline}>
        {isTimeline || isSetting || isChannel ? (
          <span className={styles.menuTimelineLink}>{headerTitle}</span>
        ) : (
          <Link to="/" className={styles.menuTimelineLink}>
            {headerTitle}
          </Link>
        )}
      </li>
      {!isSetting && (
        <li>
          <Link to="/setting" className={styles.menuSettingLink}>
            <IconSetting className={styles.menuSettingLinkIcon} />
          </Link>
        </li>
      )}
    </ul>
  );
};
