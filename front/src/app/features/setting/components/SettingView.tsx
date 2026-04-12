import { Menu } from 'app/components/menu/Menu';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';

import { DeepLinkSetting } from './DeepLinkSetting';
import { ChannelMatchSetting } from './ChannelMatchSetting';
import { KeywordMatchSetting } from './KeywordMatchSetting';
import { MarkAsReadSetting } from './MarkAsReadSetting';

export const SettingView = () => {
  const { showToast } = useMappedState([getSettingState], s => ({
    showToast: s.showToast,
  }));
  const { hideToast } = useActions(SettingActions);

  React.useEffect(() => {
    if (!showToast) return;
    const id = setTimeout(() => hideToast(), 2000);
    return () => clearTimeout(id);
  }, [showToast, hideToast]);

  return (
    <>
      <Menu />
      <div className="setting">
        <DeepLinkSetting></DeepLinkSetting>
        <ChannelMatchSetting></ChannelMatchSetting>
        <KeywordMatchSetting></KeywordMatchSetting>
        <MarkAsReadSetting></MarkAsReadSetting>
      </div>
      {showToast && <div className="setting-toast">保存しました</div>}
    </>
  );
};
