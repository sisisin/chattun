import { settingRepository } from 'app/services/localstorage/SettingRepository';
import { Theme, TimelineSettings } from 'app/types/TimelineSettings';
import { GlobalSettingActions, GlobalSettingState, handle } from './interface';

function applyTheme(theme: Theme) {
  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  document.documentElement.setAttribute('data-theme', resolvedTheme);
}

let mediaQueryCleanup: (() => void) | null = null;

function setupThemeListener(theme: Theme) {
  if (mediaQueryCleanup) {
    mediaQueryCleanup();
    mediaQueryCleanup = null;
  }
  applyTheme(theme);
  if (theme === 'system') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    mediaQueryCleanup = () => mq.removeEventListener('change', handler);
  }
}

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
handle
  .epic()
  .on(GlobalSettingActions.$mounted, () => {
    const savedSetting = settingRepository.getSetting();
    const setting = savedSetting
      ? migrateSetting(savedSetting as Record<string, unknown>)
      : initialState;
    if (savedSetting) {
      settingRepository.putSetting(setting);
    }
    return GlobalSettingActions.updateGlobalSetting(setting);
  })
  .on(GlobalSettingActions.updateGlobalSetting, ({ setting }) => {
    setupThemeListener(setting.theme);
    return null;
  });

// --- Reducer ---
export const initialState: GlobalSettingState = {
  deepLinking: 'directly',
  theme: 'system',
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
