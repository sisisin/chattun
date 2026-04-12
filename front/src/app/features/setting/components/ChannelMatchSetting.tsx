import { IconArrow } from 'app/components/icons/Icons';
import React from 'react';
import { MatchMethod, ChannelMatch } from 'app/types/TimelineSettings';
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
    form: { channelMatch },
  } = useMappedState([getSettingState], s => s);

  const onSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const matchValue = formData.get('matchValue');
      const matchMethod = formData.get('matchMethod');
      if (typeof matchValue !== 'string' || typeof matchMethod !== 'string') return;
      const data: ChannelMatch = {
        matchValue,
        matchMethod: matchMethod as MatchMethod,
      };
      updateSetting({ channelMatch: data });
    },
    [updateSetting],
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="setting-group">
        <h3 className="setting-group-title">Channel Match</h3>
        <div className="setting-group-match">
          <input
            name="matchValue"
            defaultValue={channelMatch?.matchValue ?? ''}
            placeholder="例: times_"
          ></input>
          <div className="select-group">
            <select
              className="select-group-item"
              name="matchMethod"
              defaultValue={channelMatch?.matchMethod}
            >
              {Object.values(matchOptions).map(({ text, value }) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
            <IconArrow className="select-group-chaticon" />
          </div>
          <button className="button-primary" type="submit">
            設定する
          </button>
        </div>
      </div>
    </form>
  );
};
