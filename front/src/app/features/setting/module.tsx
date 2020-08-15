import React from 'react';
import { SettingView } from './components/SettingView';
import { handle, SettingState, SettingActions, getSettingState } from './interface';
import { settingRepository } from 'app/services/localstorage/SettingRepository';
import { getGlobalSettingState, GlobalSettingActions } from '../globalSetting/interface';

// --- Epic ---
handle
  .epic()
  .on(SettingActions.$mounted, () => {
    const globalSetting = getGlobalSettingState();
    return SettingActions.updateSettingFulfilled({ ...initialState, ...globalSetting });
  })
  .on(SettingActions.updateSetting, ({ diff }) => {
    const { form } = getSettingState();
    const newSetting = { ...form, ...diff };
    settingRepository.putSetting(newSetting);
    return [
      GlobalSettingActions.updateGlobalSetting(newSetting),
      SettingActions.updateSettingFulfilled(newSetting),
    ];
  })
  .on(SettingActions.updateTimelineSetting, ({ index, diff }) => {
    const { form } = getSettingState();
    const newSetting = { ...form };
    newSetting.timelines = [...newSetting.timelines];
    newSetting.timelines[index] = { ...newSetting.timelines[index], ...diff };
    settingRepository.putSetting(newSetting);
    return [
      GlobalSettingActions.updateGlobalSetting(newSetting),
      SettingActions.updateSettingFulfilled(newSetting),
    ];
  });

// --- Reducer ---
export const initialState: SettingState = {
  form: {
    deepLinking: 'viaBrowser',
    markAsRead: false,
    timelines: [
      {
        channelMatch: undefined,
        keywordMatch: undefined,
      },
    ],
  },
};

export const reducer = handle
  .reducer(initialState)
  .on(SettingActions.updateSettingFulfilled, (state, { newSetting }) => {
    state.form = newSetting;
  });

// --- Module ---
export const SettingModule = () => {
  handle();
  return <SettingView />;
};
