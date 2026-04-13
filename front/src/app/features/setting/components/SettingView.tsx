import { Menu } from 'app/components/menu/Menu';
import React from 'react';
import styles from './Setting.module.css';

import { DeepLinkSetting } from './DeepLinkSetting';
import { ThemeSetting } from './ThemeSetting';
import { ChannelMatchSetting } from './ChannelMatchSetting';
import { MuteUsersSetting } from './MuteUsersSetting';
import { DeveloperModeSetting } from './DeveloperModeSetting';

export const SettingView = () => {
  return (
    <>
      <Menu />
      <div className={styles.setting}>
        <DeepLinkSetting></DeepLinkSetting>
        <ThemeSetting></ThemeSetting>
        <ChannelMatchSetting></ChannelMatchSetting>
        <MuteUsersSetting></MuteUsersSetting>
        <DeveloperModeSetting></DeveloperModeSetting>
      </div>
    </>
  );
};
