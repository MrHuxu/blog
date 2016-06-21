import '../node_modules/animate.css/animate.min.css';
import '../node_modules/highlight.js/styles/github.css';
import '../node_modules/nprogress/nprogress.css';

import $ from 'jquery';
window.jQuery = $; // Assure it's available globally.

import React from 'react';
import reactDom from 'react-dom';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { rootStore } from './store';
import routes from './routes/routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

injectTapEventPlugin();

reactDom.render(
  <MuiThemeProvider muiTheme = {getMuiTheme()}>
    <Provider store = {rootStore}>
      <Router routes = {routes} history = {browserHistory} />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('blog')
);
