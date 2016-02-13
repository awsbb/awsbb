import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import { Provider } from 'react-redux';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import { syncHistory, routeReducer } from 'react-router-redux';

import reducers from './reducers';

// hard refresh works but has warning
// import createHistory from 'history/lib/createHashHistory';
// const history = createHistory();

// hard refresh breaks
// import useRouterHistory from 'react-router/lib/useRouterHistory';
// import createHashHistory from 'history/lib/createHashHistory';
// const history = useRouterHistory(createHashHistory)();

// hard refresh breaks
import hashHistory from 'react-router/lib/hashHistory';
const history = hashHistory;

const logger = createLogger();
const middleware = syncHistory(history);

const reducer = combineReducers(Object.assign({}, {
  store: reducers
}, {
  routing: routeReducer
}));

const store = compose(autoRehydrate(), applyMiddleware(
  middleware,
  thunk,
  logger
))(createStore)(reducer);

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
      <Route path="/" component={App}>
        <IndexRoute component={AppHome} />
        <Route path="about" component={AppAbout} />
        <Route path="login" component={AppLogin} />
        <Route path="lostPassword" component={AppLostPassword} />
        <Route path="register" component={AppRegister} />
        <Route path="reset" component={AppReset} />
        <Route path="thanks" component={AppThanks} />
        <Route path="verify" component={AppVerify} />
      </Route>
      <Route path="/user" component={User}>
        <IndexRoute component={UserHome} />
        <Route path="changePassword" component={UserChangePassword} />
      </Route>
      <Route path="*" component={NoMatch} />
    </Router>
  </Provider>,
  document.getElementById('app')
);
