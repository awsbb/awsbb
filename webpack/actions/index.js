
import { Rover } from '../common';
import * as Dispatchers from '../dispachers';
import { routeActions } from 'redux-simple-router';

export function queryAPI({ method = 'GET', url, query = {}, data = {}, authenticated = false, forceLogout, resolveRoute, rejectRoute }) {
  const queryString = Object.keys(query).map((key) => {
    return `${key}=${query[key]}`;
  }).join('&');
  if (queryString) {
    url += `?${queryString}`;
  }
  const config = {
    method,
    body: JSON.stringify(data)
  };
  return (dispatch) => {
    dispatch(Dispatchers.dataRequest());
    Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(Dispatchers.dataSuccess(data));
        if (forceLogout) {
          if (resolveRoute) {
            return dispatch(exports.logout(resolveRoute));
          }
          return dispatch(exports.logout());
        }
        if (resolveRoute) {
          dispatch(routeActions.push(resolveRoute));
        }
      })
      .catch((err) => {
        dispatch(Dispatchers.dataFailure(err.message || err.errorMessage));
        if (rejectRoute) {
          dispatch(routeActions.push(rejectRoute));
        }
      });
  };
}

export function login({ email, password, resolveRoute = '/', rejectRoute }) {
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
        if (resolveRoute) {
          dispatch(routeActions.push(resolveRoute));
        }
      })
      .catch((err) => {
        dispatch(Dispatchers.loginFailure(err.message || err.errorMessage));
        if (rejectRoute) {
          dispatch(routeActions.push(rejectRoute));
        }
      });
  };
}

export function logout(resolveRoute) {
  return (dispatch) => {
    dispatch(Dispatchers.logoutRequest());
    localStorage.removeItem('token');
    localStorage.removeItem('sessionID');
    localStorage.removeItem('user');
    dispatch(Dispatchers.logoutSuccess());
    if (resolveRoute) {
      dispatch(routeActions.push(resolveRoute));
    }
  };
}
