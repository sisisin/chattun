import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { SettingActions, getSettingState } from '../interface';

export const MarkAsReadSetting: React.FC = () => {
  const { updateSetting } = useActions(SettingActions);
  const {
    form: { markAsRead },
  } = useMappedState([getSettingState], s => s);
  return (
    <div className="setting-group">
      <h3 className="setting-group-title">Mark As Read(Experimental)</h3>
      <div className="select-group">
        <input
          className="button-primary"
          type="checkbox"
          checked={markAsRead}
          onChange={e => {
            updateSetting({ markAsRead: e.target.checked });
          }}
        ></input>
      </div>
    </div>
  );
};
