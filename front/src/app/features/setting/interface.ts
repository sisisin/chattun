import { GlobalSettings, TimelineSetting } from 'app/types/TimelineSettings';
import { createModule } from 'typeless';
import { SettingSymbol } from './symbol';

// --- Actions ---
export const [handle, SettingActions, getSettingState] = createModule(SettingSymbol)
  .withActions({
    $mounted: null,
    updateSetting: (diff: Partial<GlobalSettings>) => ({
      payload: { diff },
    }),
    updateTimelineSetting: (index: number, diff: Partial<TimelineSetting>) => ({
      payload: { index, diff },
    }),
    updateSettingFulfilled: (newSetting: GlobalSettings) => ({
      payload: { newSetting },
    }),
  })
  .withState<SettingState>();

// --- Types ---
export interface SettingState {
  form: GlobalSettings;
}
