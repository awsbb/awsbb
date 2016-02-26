import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import hashHistory from 'react-router/lib/hashHistory';

import { Provider } from 'react-redux';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';

import reducers from './reducers';

const middleware = routerMiddleware(hashHistory);
const logger = createLogger();

const reducer = combineReducers(Object.assign({}, {
  store: reducers
}, {
  routing: routerReducer
}));

const store = compose(autoRehydrate(), applyMiddleware(
  middleware,
  thunk,
  logger
))(createStore)(reducer);

const history = syncHistoryWithStore(hashHistory, store);

persistStore(store, {
  blacklist: []
});

// CONTAINERS
import App from './containers/App';
import User from './containers/User';
// INDEXES
import AppHome from './views/Home';
import UserHome from './views/User/Home';
// APP ROUTES
import AppAbout from './views/About';
import AppLogin from './views/Login';
import AppLostPassword from './views/LostPassword';
import AppRegister from './views/Register';
import AppReset from './views/Reset';
import AppThanks from './views/Thanks';
import AppVerify from './views/Verify';
// USER ROUTES
import UserChangePassword from './views/User/ChangePassword';
// ERROR ROUTES
import NoMatch from './views/NoMatch';

import './style.css';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route component={App} path='/'>
        <IndexRoute component={AppHome} />
        <Route component={AppAbout} path='about' />
        <Route component={AppLogin} path='login' />
        <Route component={AppLostPassword} path='lostPassword' />
        <Route component={AppRegister} path='register' />
        <Route component={AppReset} path='reset' />
        <Route component={AppThanks} path='thanks' />
        <Route component={AppVerify} path='verify' />
      </Route>
      <Route component={User} path='/user' >
        <IndexRoute component={UserHome} />
        <Route component={UserChangePassword} path='changePassword' />
      </Route>
      <Route component={NoMatch} path='*' />
    </Router>
  </Provider>,
  document.getElementById('app')
);
