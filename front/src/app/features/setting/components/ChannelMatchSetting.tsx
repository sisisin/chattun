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
  const { updateSetting } = useActions(SettingActions);
  const {
    form: { channelMatch },
  } = useMappedState([getSettingState], s => s);

  return (
    <form
      onSubmit={React.useCallback(
        handleSubmit(data => {
          updateSetting({ channelMatch: data });
        }),
        [],
      )}
    >
      <div className="setting-group">
        <h3 className="setting-group-title">Channel Match</h3>
        <div className="select-group">
          <input className="button-primary" type="submit" value="設定"></input>
        </div>
        <div className="select-group">
          <input
            name="matchValue"
            defaultValue={channelMatch?.matchValue ?? ''}
            placeholder="例: times_"
            ref={register}
          ></input>
        </div>
        <div className="select-group">
          <select name="matchMethod" ref={register} defaultValue={channelMatch?.matchMethod}>
            {Object.values(matchOptions).map(({ text, value }) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
          <IconArrow className="select-group-chaticon" />
        </div>
      </div>
    </form>
  );
};
