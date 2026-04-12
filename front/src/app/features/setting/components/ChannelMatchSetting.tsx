import { IconArrow } from 'app/components/icons/Icons';
import React from 'react';
import { ChannelMatch, MatchMethod } from 'app/types/TimelineSettings';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';

const matchOptions: { [K in MatchMethod]: { text: string; value: K } } = {
  contain: { text: '含む', value: 'contain' },
  startsWith: { text: '前方一致', value: 'startsWith' },
  endsWith: { text: '後方一致', value: 'endsWith' },
};

interface ChannelMatchRowProps {
  match: ChannelMatch;
  onChange: (updated: ChannelMatch) => void;
  onRemove: () => void;
}

const ChannelMatchRow: React.FC<ChannelMatchRowProps> = ({ match, onChange, onRemove }) => {
  return (
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
      <button className="button-remove" type="button" onClick={onRemove}>
        ✕
      </button>
    </div>
  );
};

function hasChanges(local: ChannelMatch[], stored: ChannelMatch[]): boolean {
  if (local.length !== stored.length) return true;
  return local.some(
    (m, i) => m.matchValue !== stored[i].matchValue || m.matchMethod !== stored[i].matchMethod,
  );
}

function hasEmptyValues(matches: ChannelMatch[]): boolean {
  return matches.some(m => m.matchValue === '');
}

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

  const handleSave = () => {
    updateSetting({ channelMatches: localMatches });
  };

  const canSave = hasChanges(localMatches, channelMatches) && !hasEmptyValues(localMatches);

  return (
    <div className="setting-group">
      <h3 className="setting-group-title">チャンネル絞り込み</h3>
      {localMatches.map((match, index) => (
        <ChannelMatchRow
          key={index}
          match={match}
          onChange={updated => handleChange(index, updated)}
          onRemove={() => handleRemove(index)}
        />
      ))}
      <div className="setting-group-footer">
        <button className="button-add" type="button" onClick={handleAdd}>
          + 条件を追加
        </button>
        {localMatches.length > 0 && (
          <button className="button-primary" type="button" disabled={!canSave} onClick={handleSave}>
            保存
          </button>
        )}
      </div>
    </div>
  );
};
