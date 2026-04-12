import { Menu } from 'app/components/menu/Menu';
import React from 'react';

import { DeepLinkSetting } from './DeepLinkSetting';
import { ChannelMatchSetting } from './ChannelMatchSetting';
import { MuteUsersSetting } from './MuteUsersSetting';
import { MarkAsReadSetting } from './MarkAsReadSetting';
import { DeveloperModeSetting } from './DeveloperModeSetting';

export const SettingView = () => {
  return (
    <>
      <Menu />
      <div className="setting">
        <DeepLinkSetting></DeepLinkSetting>
        <ChannelMatchSetting></ChannelMatchSetting>
        <MuteUsersSetting></MuteUsersSetting>
        <MarkAsReadSetting></MarkAsReadSetting>
        <DeveloperModeSetting></DeveloperModeSetting>
      </div>
    </>
  );
};
