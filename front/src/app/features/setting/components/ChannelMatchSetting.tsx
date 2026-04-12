import { IconArrow } from 'app/components/icons/Icons';
import React from 'react';
import { MatchMethod } from 'app/types/TimelineSettings';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';

const matchOptions: { [K in MatchMethod]: { text: string; value: K } } = {
  contain: { text: 'contain', value: 'contain' },
  startsWith: { text: 'startsWith', value: 'startsWith' },
  endsWith: { text: 'endsWith', value: 'endsWith' },
};

export const ChannelMatchSetting: React.FC = () => {
  const { updateSetting } = useActions(SettingActions);
  const {
    form: { channelMatches },
  } = useMappedState([getSettingState], s => s);

  const handleAdd = () => {
    updateSetting({
      channelMatches: [...channelMatches, { matchMethod: 'startsWith', matchValue: '' }],
    });
  };

  const handleRemove = (index: number) => {
    updateSetting({ channelMatches: channelMatches.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, index: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const matchValue = formData.get('matchValue');
    const matchMethod = formData.get('matchMethod');
    if (typeof matchValue !== 'string' || typeof matchMethod !== 'string') return;
    const updated = channelMatches.map((m, i) =>
      i === index ? { matchValue, matchMethod: matchMethod as MatchMethod } : m,
    );
    updateSetting({ channelMatches: updated });
  };

  return (
    <div className="setting-group">
      <h3 className="setting-group-title">Channel Match</h3>
      {channelMatches.map((match, index) => (
        <form key={index} onSubmit={e => handleSubmit(e, index)}>
          <div className="setting-group-match">
            <input name="matchValue" defaultValue={match.matchValue} placeholder="例: times-eng-" />
            <div className="select-group">
              <select
                className="select-group-item"
                name="matchMethod"
                defaultValue={match.matchMethod}
              >
                {Object.values(matchOptions).map(({ text, value }) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </select>
              <IconArrow className="select-group-chaticon" />
            </div>
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
        + 条件を追加
      </button>
    </div>
  );
};
