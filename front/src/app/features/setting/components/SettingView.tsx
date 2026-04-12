import { Menu } from 'app/components/menu/Menu';
import React from 'react';
import { useMappedState } from 'typeless';
import { getSettingState } from '../interface';

import { DeepLinkSetting } from './DeepLinkSetting';
import { ChannelMatchSetting } from './ChannelMatchSetting';
import { KeywordMatchSetting } from './KeywordMatchSetting';
import { MarkAsReadSetting } from './MarkAsReadSetting';

export const SettingView = () => {
  const { showToast } = useMappedState([getSettingState], s => ({
    showToast: s.showToast,
  }));

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
