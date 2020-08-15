import { GlobalSettings } from 'app/types/TimelineSettings';
import { createModule } from 'typeless';
import { GlobalSettingSymbol } from './symbol';

// --- Actions ---
export const [handle, GlobalSettingActions, getGlobalSettingState] = createModule(
  GlobalSettingSymbol,
)
  .withActions({
    $mounted: null,
    updateGlobalSetting: (setting: GlobalSettings) => ({
      payload: { setting },
    }),
  })
  .withState<GlobalSettingState>();

// --- Types ---
export type GlobalSettingState = GlobalSettings;
