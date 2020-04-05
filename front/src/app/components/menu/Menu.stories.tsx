import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Menu } from './Menu';
import { AppProvider } from 'app/utility/storybook/helpers';

storiesOf('Menu', module).add('main', () => {
  return (
    <AppProvider>
      <Menu />
    </AppProvider>
  );
});
