import { IconArrow, IconSetting } from 'app/components/icons/Icons';
import { useRouter } from 'app/hooks/useRouter';
import * as React from 'react';
import { Link } from 'react-router-dom';

export const Menu: React.FC = () => {
  const { location } = useRouter();
  // todo: storybook上でも正しく動くようにしたい
  const isTimeline = location.pathname === '/';

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
        {/* todo: storybookで見えなくなってる & そもそもこのリンクいる？ */}
        <Link to="/" className="menu-timeline-link">
          すべての投稿
        </Link>
      </li>
      <li className="menu-setting">
        <Link to="/setting" className="menu-setting-link">
          <IconSetting className="menu-setting-link-icon" />
        </Link>
      </li>
    </ul>
  );
};
