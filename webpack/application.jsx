'use strict';

import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import createHistory from 'history/lib/createHashHistory';
import { Provider } from 'react-redux';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncHistory, routeReducer } from 'redux-simple-router';

import reducers from './reducers';

const history = createHistory();
const middleware = syncHistory(history);

const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer
}));

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey='ctrl-h' changePositionKey='ctrl-q'>
    <LogMonitor theme='tomorrow' />
  </DockMonitor>
);

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(history);
const createStoreWithMiddleware = compose(applyMiddleware(
  middleware,
  thunkMiddleware
), DevTools.instrument())(createStore);

const store = createStoreWithMiddleware(reducer);

// Required for replaying actions from devtools to work
reduxRouterMiddleware.listenForReplays(store);

import App from './containers/App';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import About from './views/About';

import './style.css';

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="login" component={Login} />
          <Route path="register" component={Register} />
          <Route path="about" component={About} />
        </Route>
      </Router>
      <DevTools />
    </div>
  </Provider>,
  document.getElementById('app')
);
