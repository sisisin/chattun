import { RouterProvider } from '@tanstack/react-router';
import { useSlackModule } from 'app/features/slack/module';
import { router } from 'app/router';
import * as React from 'react';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { useGlobalSettingModule } from './features/globalSetting/module';
import { useSessionModule } from './features/session/module';
import { Toast } from './features/toast/module';

export const App = () => {
  useSessionModule();
  useGlobalSettingModule();
  useSlackModule();

  return (
    <>
      <RouterProvider router={router} />
      <Toast />
      <PwaInstallBanner />
    </>
  );
};
