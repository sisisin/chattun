import { settingRepository } from 'app/services/localstorage/SettingRepository';
import { GlobalSettingActions, GlobalSettingState, handle } from './interface';

// --- Epic ---
handle.epic().on(GlobalSettingActions.$mounted, () => {
  const savedSetting = settingRepository.getSetting();
  return GlobalSettingActions.updateGlobalSetting(savedSetting || initialState);
});

// --- Reducer ---
export const initialState: GlobalSettingState = {
  deepLinking: 'directly',
  channelMatch: undefined,
  keywordMatch: undefined,
  markAsRead: true,
};

export const reducer = handle
  .reducer(initialState)
  .replace(GlobalSettingActions.updateGlobalSetting, (state, { setting }) => {
    return setting as GlobalSettingState;
  });

// --- Module ---
export const useGlobalSettingModule = () => {
  handle();
};
