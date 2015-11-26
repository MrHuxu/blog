import '../public/css/style.css';
import '../node_modules/animate.css/animate.min.css';
import '../node_modules/highlight.js/styles/github.css';

import React, { Component } from 'react';
import reactDom from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { rootStore } from './store';

import routes from './routes/routes';
import history from './routes/history';

var devDom = <Router routes={routes}></Router>
var prdDom = <Router history={history} routes={routes}></Router>

reactDom.render(
  <Provider store={rootStore}>
    {'development' !== process.env.NODE_ENV ? prdDom : devDom}
  </Provider>,
  document.getElementById('blog')
);