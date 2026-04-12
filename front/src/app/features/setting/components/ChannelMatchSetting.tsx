import { IconArrow } from 'app/components/icons/Icons';
import React from 'react';
import { ChannelMatch, MatchMethod } from 'app/types/TimelineSettings';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';

const matchOptions: { [K in MatchMethod]: { text: string; value: K } } = {
  contain: { text: 'contain', value: 'contain' },
  startsWith: { text: 'startsWith', value: 'startsWith' },
  endsWith: { text: 'endsWith', value: 'endsWith' },
};

interface ChannelMatchRowProps {
  match: ChannelMatch;
  onChange: (updated: ChannelMatch) => void;
  onRemove: () => void;
  onSave: () => void;
}

const ChannelMatchRow: React.FC<ChannelMatchRowProps> = ({ match, onChange, onRemove, onSave }) => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave();
      }}
    >
      <div className="setting-group-match">
        <input
          value={match.matchValue}
          onChange={e => onChange({ ...match, matchValue: e.target.value })}
          placeholder="例: times-eng-"
        />
        <div className="select-group">
          <select
            className="select-group-item"
            value={match.matchMethod}
            onChange={e => onChange({ ...match, matchMethod: e.target.value as MatchMethod })}
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
          <button className="button-remove" type="button" onClick={onRemove}>
            ✕
          </button>
        </span>
      </div>
    </form>
  );
};

export const ChannelMatchSetting: React.FC = () => {
  const { updateSetting } = useActions(SettingActions);
  const {
    form: { channelMatches },
  } = useMappedState([getSettingState], s => s);

  const [localMatches, setLocalMatches] = React.useState<ChannelMatch[]>(channelMatches);

  React.useEffect(() => {
    setLocalMatches(channelMatches);
  }, [channelMatches]);

  const handleAdd = () => {
    setLocalMatches([...localMatches, { matchMethod: 'startsWith', matchValue: '' }]);
  };

  const handleRemove = (index: number) => {
    const updated = localMatches.filter((_, i) => i !== index);
    setLocalMatches(updated);
    updateSetting({ channelMatches: updated });
  };

  const handleChange = (index: number, updated: ChannelMatch) => {
    setLocalMatches(localMatches.map((m, i) => (i === index ? updated : m)));
  };

  const handleSave = (index: number) => {
    const match = localMatches[index];
    if (match.matchValue === '') return;
    updateSetting({ channelMatches: localMatches });
  };

  return (
    <div className="setting-group">
      <h3 className="setting-group-title">Channel Match</h3>
      {localMatches.map((match, index) => (
        <ChannelMatchRow
          key={index}
          match={match}
          onChange={updated => handleChange(index, updated)}
          onRemove={() => handleRemove(index)}
          onSave={() => handleSave(index)}
        />
      ))}
      <button className="button-add" type="button" onClick={handleAdd}>
        + 条件を追加
      </button>
    </div>
  );
};
