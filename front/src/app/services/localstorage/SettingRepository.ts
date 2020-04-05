import { TimelineSettings } from 'app/types/TimelineSettings';

class SettingRepository {
  getSetting(): TimelineSettings | null {
    const loaded = localStorage.getItem('setting');
    return !loaded ? null : (JSON.parse(loaded) as TimelineSettings);
  }
  putSetting(setting: TimelineSettings) {
    localStorage.setItem('setting', JSON.stringify(setting));
  }
}

export const settingRepository = new SettingRepository();
