'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes.jsx';
import Router from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import './css/application.css';

let history = createBrowserHistory();
ReactDOM.render(
  <Router history={history} routes={routes}/>,
  document.getElementById('app')
);
