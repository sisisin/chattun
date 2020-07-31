import { Menu } from 'app/components/menu/Menu';
import React from 'react';

import { DeepLinkSetting } from './DeepLinkSetting';
import { ChannelMatchSetting } from './ChannelMatchSetting';
import { KeywordMatchSetting } from './KeywordMatchSetting';
import { MarkAsReadSetting } from './MarkAsReadSetting';

export const SettingView = () => {
  return (
    <>
      <Menu />
      <div className="setting">
        <DeepLinkSetting></DeepLinkSetting>
        <ChannelMatchSetting></ChannelMatchSetting>
        <KeywordMatchSetting></KeywordMatchSetting>
        <MarkAsReadSetting></MarkAsReadSetting>
      </div>
    </>
  );
};
