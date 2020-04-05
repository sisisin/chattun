import { TimelineSettings } from 'app/types/TimelineSettings';
import { createModule } from 'typeless';
import { SettingSymbol } from './symbol';

// --- Actions ---
export const [handle, SettingActions, getSettingState] = createModule(SettingSymbol)
  .withActions({
    $mounted: null,
    updateSetting: (diff: Partial<TimelineSettings>) => ({
      payload: { diff },
    }),
    updateSettingFulfilled: (newSetting: TimelineSettings) => ({
      payload: { newSetting },
    }),
  })
  .withState<SettingState>();

// --- Types ---
export interface SettingState {
  form: TimelineSettings;
}
