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

persistStore(store, {
  blacklist: ['authorize', 'data']
});

// CONTAINER
import App from './containers/App';
// INDEX
import Home from './views/Home';
// ROUTES
import About from './views/About';
import Login from './views/Login';
import LostPassword from './views/LostPassword';
import Profile from './views/Profile';
import Register from './views/Register';
import Reset from './views/Reset';
import Thanks from './views/Thanks';

import './style.css';

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="about" component={About} />
          <Route path="login" component={Login} />
          <Route path="lostPassword" component={LostPassword} />
          <Route path="profile" component={Profile} />
          <Route path="register" component={Register} />
          <Route path="reset" component={Reset} />
          <Route path="thanks" component={Thanks} />
        </Route>
      </Router>
    </div>
  </Provider>,
  document.getElementById('app')
);
