import { IconArrow } from 'app/components/icons/Icons';
import { Theme } from 'app/types/TimelineSettings';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';
import settingStyles from './Setting.module.css';

const themeOptions: { value: Theme; label: string }[] = [
  { value: 'system', label: 'システム' },
  { value: 'light', label: 'ライト' },
  { value: 'dark', label: 'ダーク' },
];

export const ThemeSetting: React.FC = () => {
  const { updateSetting } = useActions(SettingActions);
  const {
    form: { theme },
  } = useMappedState([getSettingState], s => s);

  return (
    <div className={settingStyles.settingGroup}>
      <h3 className="setting-group-title">テーマ</h3>
      <div className="select-group">
        <select
          className="select-group-item"
          value={theme}
          onChange={e => {
            updateSetting({ theme: e.target.value as Theme });
          }}
        >
          {themeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <IconArrow className="select-group-chaticon" />
      </div>
    </div>
  );
};
