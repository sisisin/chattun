import { IconArrow } from 'app/components/icons/Icons';
import React from 'react';
import { KeywordMatchMethod, KeywordMatch } from 'app/types/TimelineSettings';
import { useActions, useMappedState } from 'typeless';
import { getSettingState, SettingActions } from '../interface';

const matchOptions: { [K in KeywordMatchMethod]: { text: string; value: K } } = {
  notContain: { text: 'notContain', value: 'notContain' },
};

export const KeywordMatchSetting: React.FC = () => {
  const { updateSetting } = useActions(SettingActions);
  const {
    form: { keywordMatch },
  } = useMappedState([getSettingState], s => s);

  const onSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const matchValue = formData.get('matchValue');
      const matchMethod = formData.get('matchMethod');
      if (typeof matchValue !== 'string' || typeof matchMethod !== 'string') return;
      const data: KeywordMatch = {
        matchValue,
        matchMethod: matchMethod as KeywordMatchMethod,
      };
      updateSetting({ keywordMatch: data });
    },
    [updateSetting],
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="setting-group">
        <h3 className="setting-group-title">Keyword Match</h3>
        <div className="setting-group-match">
          <input
            name="matchValue"
            defaultValue={keywordMatch?.matchValue ?? ''}
            placeholder="例: Satan"
          ></input>
          <div className="select-group">
            <select
              className="select-group-item"
              name="matchMethod"
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
