import { handle as globalSettingHandle } from 'app/features/globalSetting/interface';
import {
  initialState as globalInitialState,
  useGlobalSettingModule,
} from 'app/features/globalSetting/module';
import { handle as slackHandle } from 'app/features/slack/interface';
import { initialState as slackInitialState, useSlackModule } from 'app/features/slack/module';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Registry, TypelessContext } from 'typeless';

slackHandle.reset();
slackHandle.reducer(slackInitialState);
globalSettingHandle.reset();
globalSettingHandle.reducer(globalInitialState);

const WithModule = (props: any) => {
  useGlobalSettingModule();
  useSlackModule();

  return props.children;
};
export const AppProvider: React.FC<{ registry?: Registry }> = props => {
  return (
    <TypelessContext.Provider value={{ registry: props.registry ?? new Registry() }}>
      <MemoryRouter>
        <WithModule>{props.children}</WithModule>
      </MemoryRouter>
    </TypelessContext.Provider>
  );
};
