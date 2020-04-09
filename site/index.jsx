import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './page';
// import 'element-theme-default';
import './styles/base.scss';
import './styles/prism.css';

render(<AppContainer><App /></AppContainer>, document.getElementById('app'));

if (module.hot) {
  module.hot.accept('./page', () => {
    const HotApp = require('./page').default;
    render(<AppContainer><HotApp /></AppContainer>, document.getElementById('app'));
  });
}
