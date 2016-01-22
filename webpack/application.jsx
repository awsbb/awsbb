'use strict';

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import createHistory from 'history/lib/createHashHistory';
import { Provider } from 'react-redux';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import { syncHistory, routeReducer } from 'redux-simple-router';

import reducers from './reducers';

const history = createHistory();
const logger = createLogger();
const middleware = syncHistory(history);

const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer
}));

const store = compose(autoRehydrate(), applyMiddleware(
  middleware,
  thunk,
  logger
))(createStore)(reducer);

persistStore(store);

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
    </div>
  </Provider>,
  document.getElementById('app')
);
