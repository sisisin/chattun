import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { TypelessContext } from 'typeless';
import { appRegistry } from 'app/services/AppRegistry';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <TypelessContext.Provider value={{ registry: appRegistry }}>
      <App />
    </TypelessContext.Provider>,
  );
  root.unmount();
  expect(true).toBeTruthy();
});
