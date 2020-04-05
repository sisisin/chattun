import { IconArrow } from 'app/components/icons/Icons';
import { DeepLinking } from 'app/types/TimelineSettings';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';

const deepLinkingOptions: { [K in DeepLinking]: { text: string; value: K } } = {
  viaBrowser: { text: 'Via Web Browser', value: 'viaBrowser' },
  directly: { text: 'Open Slack App Directly', value: 'directly' },
};

export const DeepLinkSetting: React.FC = () => {
  const { updateSetting } = useActions(SettingActions);
  const { form } = useMappedState([getSettingState], setting => setting);
  return (
    <div className="setting-group">
      <h3 className="setting-group-title">Deep Linking</h3>
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
