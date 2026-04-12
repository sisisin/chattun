import { Link } from '@tanstack/react-router';
import { IconArrow, IconSetting } from 'app/components/icons/Icons';
import { useRouter } from 'app/hooks/useRouter';
import * as React from 'react';

export const Menu: React.FC = () => {
  const { location } = useRouter();
  const isTimeline = location.pathname === '/';
  const isSetting = location.pathname === '/setting';

  return (
    <ul className="menu">
      <li className="menu-goback">
        <Link to="/" className="menu-goback-link">
          {!isTimeline && (
            <span className="menu-goback-link-item">
              <IconArrow className="menu-goback-link-item-icon" />
              <span>戻る</span>
            </span>
          )}
        </Link>
      </li>
      <li className="menu-timeline">
        {isSetting ? (
          <span className="menu-timeline-link">設定</span>
        ) : (
          <Link to="/" className="menu-timeline-link">
            すべての投稿
          </Link>
        )}
      </li>
      {!isSetting && (
        <li className="menu-setting">
          <Link to="/setting" className="menu-setting-link">
            <IconSetting className="menu-setting-link-icon" />
          </Link>
        </li>
      )}
    </ul>
  );
};
