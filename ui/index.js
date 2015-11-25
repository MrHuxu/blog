import '../public/css/style.css';
import '../node_modules/animate.css/animate.min.css';

import React, { Component } from 'react';
import reactDom from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { rootStore } from './store';

import routes from './routes/routes';
import history from './routes/history';

reactDom.render(
  <Provider store={rootStore}>
    <Router routes={routes}></Router>
  </Provider>,
  document.getElementById('blog')
);