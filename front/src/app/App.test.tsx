import * as React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { DefaultTypelessProvider } from 'typeless';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <DefaultTypelessProvider>
      <App />
    </DefaultTypelessProvider>,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
  expect(true).toBeTruthy();
});
