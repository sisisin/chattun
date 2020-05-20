import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { SettingActions, getSettingState } from '../interface';
import { IconCheck } from 'app/components/icons/Icons';

export const MarkAsReadSetting: React.FC = () => {
  const { updateSetting } = useActions(SettingActions);
  const {
    form: { markAsRead },
  } = useMappedState([getSettingState], s => s);
  return (
    <div className="setting-group">
      <h3 className="setting-group-title">Mark as Read (Experimental)</h3>
      <div className="select-group">
        <label htmlFor="asread" className="select-group-label">
          <input
            id="asread"
            type="checkbox"
            checked={markAsRead}
            onChange={e => {
              updateSetting({ markAsRead: e.target.checked });
            }}
          />
          <IconCheck className="checkbox-chaticon" />
          Mark as Read
        </label>
      </div>
    </div>
  );
};
