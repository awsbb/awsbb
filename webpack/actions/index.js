
import { Rover } from '../common';
import * as Dispatchers from '../dispachers';
import { routeActions } from 'redux-simple-router';

const resolveUrlWithQUery = ({ url, query }) => {
  let result = url;
  const queryString = Object.keys(query).map((key) => {
    return `${key}=${query[key]}`;
  }).join('&');
  if (queryString) {
    result += `?${queryString}`;
  }
  return result;
};

const resolveConfig = ({ method = 'GET', data = {} }) => {
  const config = {
    method
  };
  switch (method.toUpperCase()) {
    case 'GET':
    case 'HEAD':
      break;
    default:
      config.body = JSON.stringify(data);
      break;
  }
  return config;
};

export function queryAPIThenLogout({ method = 'GET', url, query = {}, data = {}, authenticated = false, successRoute, errorRoute }) {
  const resolvedURL = resolveUrlWithQUery({ url, query });
  const config = resolveConfig({ method, data });
  return (dispatch) => {
    dispatch(Dispatchers.dataRequest());
    Rover.rover(resolvedURL, config, authenticated)
      .then((data) => {
        dispatch(Dispatchers.dataSuccess(data));
        if (successRoute) {
          return dispatch(exports.logout(successRoute));
        }
        dispatch(exports.logout());
      })
      .catch((err) => {
        dispatch(Dispatchers.dataFailure(err.message || err.errorMessage));
        if (errorRoute) {
          dispatch(routeActions.push(errorRoute));
        }
      });
  };
}

export function queryAPI({ method = 'GET', url, query = {}, data = {}, authenticated = false, successRoute, errorRoute }) {
  const resolvedURL = resolveUrlWithQUery({ url, query });
  const config = resolveConfig({ method, data });
  return (dispatch) => {
    dispatch(Dispatchers.dataRequest());
    Rover.rover(resolvedURL, config, authenticated)
      .then((data) => {
        dispatch(Dispatchers.dataSuccess(data));
        if (successRoute) {
          dispatch(routeActions.push(successRoute));
        }
      })
      .catch((err) => {
        dispatch(Dispatchers.dataFailure(err.message || err.errorMessage));
        if (errorRoute) {
          dispatch(routeActions.push(errorRoute));
        }
      });
  };
}
export function login({ email, password, successRoute = '/', errorRoute }) {
  const config = {
    method: 'POST',
    body: JSON.stringify({ email, password })
  };
  return (dispatch) => {
    dispatch(Dispatchers.loginRequest());
    Rover.rover('http://127.0.0.1:3000/api/AuthLogin', config)
      .then((data) => {
        const user = {
          email
        };
        const responseData = data.data;
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('sessionID', responseData.sessionID);
        localStorage.setItem('user', user);
        dispatch(Dispatchers.loginSuccess(user));
        if (successRoute) {
          dispatch(routeActions.push(successRoute));
        }
      })
      .catch((err) => {
        dispatch(Dispatchers.loginFailure(err.message || err.errorMessage));
        if (errorRoute) {
          dispatch(routeActions.push(errorRoute));
        }
      });
  };
}

export function logout(successRoute = '/') {
  return (dispatch) => {
    dispatch(Dispatchers.logoutRequest());
    localStorage.removeItem('token');
    localStorage.removeItem('sessionID');
    localStorage.removeItem('user');
    dispatch(Dispatchers.logoutSuccess());
    dispatch(routeActions.push(successRoute));
  };
}
