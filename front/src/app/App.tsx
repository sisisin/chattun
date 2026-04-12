import { useSlackModule } from 'app/features/slack/module';
import * as React from 'react';
import { Routes } from './components/Routes';
import { useGlobalSettingModule } from './features/globalSetting/module';
import { useSessionModule } from './features/session/module';
import { Toast } from './features/toast/module';

export const App = () => {
  useSessionModule();
  useGlobalSettingModule();
  useSlackModule();

  return (
    <>
      <Routes />
      <Toast />
    </>
  );
};
