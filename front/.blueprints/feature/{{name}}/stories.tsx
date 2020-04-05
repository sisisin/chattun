import React from 'react';

import { storiesOf } from '@storybook/react';
import { handle } from './interface';
import {{pascalCase name}}Module from './module';
import { AppProvider } from 'app/utility/storybook/helpers';

handle.reset();

storiesOf('{{pascalCase name}}', module).add('basic', () => {
  handle.reducer({ foo: 'for story' });

  return (
    <AppProvider>
      <{{pascalCase name}}Module />
    </AppProvider>
  );
});
