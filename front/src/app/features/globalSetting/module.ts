import { settingRepository } from 'app/services/localstorage/SettingRepository';
import { TimelineSettings } from 'app/types/TimelineSettings';
import { GlobalSettingActions, GlobalSettingState, handle } from './interface';

function migrateSetting(saved: Record<string, unknown>): TimelineSettings {
  const migrated = { ...initialState, ...saved };
  // Migrate legacy single channelMatch to channelMatches array
  if ('channelMatch' in saved && !('channelMatches' in saved)) {
    const legacy = saved.channelMatch as { matchMethod: string; matchValue: string } | undefined;
    migrated.channelMatches = legacy ? [legacy as TimelineSettings['channelMatches'][number]] : [];
    delete (migrated as Record<string, unknown>).channelMatch;
  }
  // Migrate legacy keywordMatch to mutedUsers array
  if ('keywordMatch' in saved && !('mutedUsers' in saved)) {
    const legacy = saved.keywordMatch as { matchValue: string } | undefined;
    migrated.mutedUsers = legacy?.matchValue ? [legacy.matchValue] : [];
    delete (migrated as Record<string, unknown>).keywordMatch;
  }
  return migrated as TimelineSettings;
}

// --- Epic ---
handle.epic().on(GlobalSettingActions.$mounted, () => {
  const savedSetting = settingRepository.getSetting();
  const setting = savedSetting
    ? migrateSetting(savedSetting as Record<string, unknown>)
    : initialState;
  if (savedSetting) {
    settingRepository.putSetting(setting);
  }
  return GlobalSettingActions.updateGlobalSetting(setting);
});

// --- Reducer ---
export const initialState: GlobalSettingState = {
  deepLinking: 'directly',
  channelMatches: [],
  mutedUsers: [],
  developerMode: false,
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
