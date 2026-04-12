import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { SettingActions, getSettingState } from '../interface';
import { IconCheck } from 'app/components/icons/Icons';

export const DeveloperModeSetting: React.FC = () => {
  const { updateSetting } = useActions(SettingActions);
  const {
    form: { developerMode },
  } = useMappedState([getSettingState], s => s);
  return (
    <div className="setting-group">
      <h3 className="setting-group-title">開発者モード</h3>
      <div className="select-group">
        <label htmlFor="devmode" className="select-group-label">
          <input
            id="devmode"
            type="checkbox"
            checked={developerMode}
            onChange={e => {
              updateSetting({ developerMode: e.target.checked });
            }}
          />
          <IconCheck className="checkbox-chaticon" />
          開発者モード
        </label>
      </div>
    </div>
  );
};
