import { IconArrow } from 'app/components/icons/Icons';
import React from 'react';
import { useForm } from 'react-hook-form';
import { KeywordMatchMethod, KeywordMatch } from 'app/types/TimelineSettings';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';

const matchOptions: { [K in KeywordMatchMethod]: { text: string; value: K } } = {
  notContain: { text: 'notContain', value: 'notContain' },
};

export const KeywordMatchSetting: React.FC = () => {
  const { register, handleSubmit } = useForm<KeywordMatch>();
  const { updateTimelineSetting } = useActions(SettingActions);
  const { keywordMatch } = useMappedState([getSettingState], s => s.form.timelines[0]);

  return (
    <form
      onSubmit={React.useCallback(
        handleSubmit(data => {
          updateTimelineSetting(0, { keywordMatch: data });
        }),
        [],
      )}
    >
      <div className="setting-group">
        <h3 className="setting-group-title">Keyword Match</h3>
        <div className="setting-group-match">
          <input
            name="matchValue"
            defaultValue={keywordMatch?.matchValue ?? ''}
            placeholder="例: Satan"
            ref={register}
          ></input>
          <div className="select-group">
            <select
              className="select-group-item"
              name="matchMethod"
              ref={register}
              defaultValue={keywordMatch?.matchMethod}
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
