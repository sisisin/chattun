import { appRegistry } from 'app/services/AppRegistry';
import React from 'react';
import ReactDOM from 'react-dom';
import { Hmr, startHmr, TypelessContext } from 'typeless';
import './app/imports';
import * as serviceWorker from './app/serviceWorker';

const MOUNT_NODE = document.getElementById('root');

if (!MOUNT_NODE) {
  throw new Error('<div id="root" /> not found');
}

const render = () => {
  const App = require('./app/App').App;
  ReactDOM.unmountComponentAtNode(MOUNT_NODE);
  ReactDOM.render(
    <Hmr>
      <TypelessContext.Provider value={{ registry: appRegistry }}>
        <App />
      </TypelessContext.Provider>
    </Hmr>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  module.hot.accept('./app/App', () => {
    startHmr();
    render();
  });
}
render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({});
