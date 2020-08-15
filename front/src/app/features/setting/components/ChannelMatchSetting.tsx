import { IconArrow } from 'app/components/icons/Icons';
import React from 'react';
import { useForm } from 'react-hook-form';
import { MatchMethod, ChannelMatch } from 'app/types/TimelineSettings';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';

const matchOptions: { [K in MatchMethod]: { text: string; value: K } } = {
  contain: { text: 'contain', value: 'contain' },
  startsWith: { text: 'startsWith', value: 'startsWith' },
  endsWith: { text: 'endsWith', value: 'endsWith' },
};

export const ChannelMatchSetting: React.FC = () => {
  const { register, handleSubmit } = useForm<ChannelMatch>();
  const { updateTimelineSetting } = useActions(SettingActions);
  const { channelMatch } = useMappedState([getSettingState], s => s.form.timelines[0]);

  return (
    <form
      onSubmit={React.useCallback(
        handleSubmit(data => {
          updateTimelineSetting(0, { channelMatch: data });
        }),
        [],
      )}
    >
      <div className="setting-group">
        <h3 className="setting-group-title">Channel Match</h3>
        <div className="setting-group-match">
          <input
            name="matchValue"
            defaultValue={channelMatch?.matchValue ?? ''}
            placeholder="例: times_"
            ref={register}
          ></input>
          <div className="select-group">
            <select
              className="select-group-item"
              name="matchMethod"
              ref={register}
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
