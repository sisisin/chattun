import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';

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

  const handleSave = (index: number) => {
    if (localUsers[index] === '') return;
    updateSetting({ mutedUsers: localUsers.filter(u => u !== '') });
  };

  return (
    <div className="setting-group">
      <h3 className="setting-group-title">ミュート</h3>
      {localUsers.map((user, index) => (
        <form
          key={index}
          onSubmit={e => {
            e.preventDefault();
            handleSave(index);
          }}
        >
          <div className="setting-group-mute">
            <input
              value={user}
              onChange={e => handleChange(index, e.target.value)}
              placeholder="Devin"
            />
            <span className="setting-group-match-actions">
              <button className="button-primary" type="submit">
                保存
              </button>
              <button className="button-remove" type="button" onClick={() => handleRemove(index)}>
                ✕
              </button>
            </span>
          </div>
        </form>
      ))}
      <button className="button-add" type="button" onClick={handleAdd}>
        + ミュートするユーザーを追加
      </button>
    </div>
  );
};
