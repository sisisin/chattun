import * as React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { TypelessContext } from 'typeless';
import { appRegistry } from 'app/services/AppRegistry';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <TypelessContext.Provider value={{ registry: appRegistry }}>
      <App />
    </TypelessContext.Provider>,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
  expect(true).toBeTruthy();
});
