import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';

function hasChanges(local: string[], stored: string[]): boolean {
  if (local.length !== stored.length) return true;
  return local.some((u, i) => u !== stored[i]);
}

function hasEmptyValues(users: string[]): boolean {
  return users.some(u => u === '');
}

export const MuteUsersSetting: React.FC = () => {
  const { updateSetting } = useActions(SettingActions);
  const {
    form: { mutedUsers },
  } = useMappedState([getSettingState], s => s);

  const [localUsers, setLocalUsers] = React.useState<string[]>(mutedUsers);

  React.useEffect(() => {
    setLocalUsers(mutedUsers);
  }, [mutedUsers]);

  const handleAdd = () => {
    setLocalUsers([...localUsers, '']);
  };

  const handleRemove = (index: number) => {
    const updated = localUsers.filter((_, i) => i !== index);
    setLocalUsers(updated);
    updateSetting({ mutedUsers: updated });
  };

  const handleChange = (index: number, value: string) => {
    setLocalUsers(localUsers.map((u, i) => (i === index ? value : u)));
  };

  const handleSave = () => {
    updateSetting({ mutedUsers: localUsers });
  };

  const canSave = hasChanges(localUsers, mutedUsers) && !hasEmptyValues(localUsers);

  return (
    <div className="setting-group">
      <h3 className="setting-group-title">ミュート</h3>
      {localUsers.map((user, index) => (
        <div key={index} className="setting-group-mute">
          <input
            value={user}
            onChange={e => handleChange(index, e.target.value)}
            placeholder="Devin"
          />
          <button className="button-remove" type="button" onClick={() => handleRemove(index)}>
            ✕
          </button>
        </div>
      ))}
      <div className="setting-group-footer">
        <button className="button-add" type="button" onClick={handleAdd}>
          + ミュートするユーザーを追加
        </button>
        {localUsers.length > 0 && (
          <button className="button-primary" type="button" disabled={!canSave} onClick={handleSave}>
            保存
          </button>
        )}
      </div>
    </div>
  );
};
