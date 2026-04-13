import { IconArrow } from 'app/components/icons/Icons';
import { DeepLinking } from 'app/types/TimelineSettings';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';
import settingStyles from './Setting.module.css';

const deepLinkingOptions: { [K in DeepLinking]: { text: string; value: K } } = {
  viaBrowser: { text: 'ブラウザで開く', value: 'viaBrowser' },
  directly: { text: 'Slackアプリで直接開く', value: 'directly' },
};

export const DeepLinkSetting: React.FC = () => {
  const { updateSetting } = useActions(SettingActions);
  const { form } = useMappedState([getSettingState], setting => setting);
  return (
    <div className={settingStyles.settingGroup}>
      <h3 className="setting-group-title">ディープリンク</h3>
      <div className="select-group">
        <select
          className="setting-group-select"
          value={form.deepLinking}
          onChange={e =>
            updateSetting({
              deepLinking: e.target.value as DeepLinking,
            })
          }
        >
          {Object.values(deepLinkingOptions).map(({ text, value }) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
        <IconArrow className="select-group-chaticon" />
      </div>
    </div>
  );
};
