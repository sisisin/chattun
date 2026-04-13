import { Link } from '@tanstack/react-router';
import { IconArrow, IconSetting } from 'app/components/icons/Icons';
import { useRouter } from 'app/hooks/useRouter';
import * as React from 'react';
import styles from './Menu.module.css';

export const Menu: React.FC = () => {
  const { location } = useRouter();
  const isTimeline = location.pathname === '/';
  const isSetting = location.pathname === '/setting';
  const isThread = location.pathname.startsWith('/thread/');

  const headerTitle = isSetting ? '設定' : isThread ? 'スレッド' : 'すべての投稿';

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
        {isTimeline ? (
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
