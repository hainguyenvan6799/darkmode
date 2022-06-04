import React from 'react';
import ReactDOM from 'react-dom';

import {
  DARKMODE_ROOT,
  MENU_SELECTOR,
  SWITCH_CLASS,
} from '../components/constants';
import Switch from '../components/Switch';

const App = () => <Switch />;

if (window.location.pathname.includes('/g/space/')) {
  const rootElement = document.createElement('div');
  rootElement.id = DARKMODE_ROOT;
  rootElement.className = SWITCH_CLASS;

  document.querySelector(MENU_SELECTOR)!.appendChild(rootElement);

  ReactDOM.render(<App />, rootElement);
}
