import { settingRepository } from 'app/services/localstorage/SettingRepository';
import { GlobalSettingActions, GlobalSettingState, handle } from './interface';

// --- Epic ---
handle.epic().on(GlobalSettingActions.$mounted, () => {
  const savedSetting = settingRepository.getSetting();
  return GlobalSettingActions.updateGlobalSetting(savedSetting || initialState);
});

// --- Reducer ---
export const initialState: GlobalSettingState = {
  deepLinking: 'viaBrowser',
  markAsRead: false,
  timelines: [{}],
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
