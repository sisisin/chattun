import React from 'react';

import { storiesOf } from '@storybook/react';
import { handle } from './interface';
import { SettingModule } from './module';
import { AppProvider } from 'app/utility/storybook/helpers';
import { initialState } from './module';

handle.reset();

storiesOf('Setting', module).add('basic', () => {
  handle.reducer(initialState);

  return (
    <AppProvider>
      <SettingModule />
    </AppProvider>
  );
});
