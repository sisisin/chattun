import { GlobalSettings, GlobalSettingsLegacy } from 'app/types/TimelineSettings';

class SettingRepository {
  getSetting(): GlobalSettings | null {
    const loaded = localStorage.getItem('setting');
    if (loaded == null) {
      return null;
    }
    const settings = JSON.parse(loaded) as GlobalSettingsLegacy;
    if (settings.timelines === undefined) {
      const { channelMatch, keywordMatch } = settings;
      settings.timelines = [
        {
          channelMatch,
          keywordMatch,
        },
      ];
    }
    return (settings as unknown) as GlobalSettings;
  }
  putSetting(setting: GlobalSettings) {
    localStorage.setItem('setting', JSON.stringify(setting));
  }
}

export const settingRepository = new SettingRepository();
