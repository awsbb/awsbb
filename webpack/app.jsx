'use strict';

import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';
import ReactDOM from 'react-dom';
import React from 'react';

import routes from './routes.jsx';
import configure from './stores';

const store = configure();
const history = createHistory();

syncReduxAndRouter(history, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('app')
);
