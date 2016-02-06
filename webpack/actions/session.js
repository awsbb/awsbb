
import { Rover } from '../common';
import { routeActions } from 'redux-simple-router';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

const loginRequest = () => {
  return {
    type: LOGIN_REQUEST
  };
};

const loginSuccess = (user) => {
  return {
    type: LOGIN_SUCCESS,
    user
  };
};

const loginFailure = (message) => {
  return {
    type: LOGIN_FAILURE,
    message
  };
};

const logoutRequest = () => {
  return {
    type: LOGOUT_REQUEST
  };
};

const logoutSuccess = () => {
  return {
    type: LOGOUT_SUCCESS
  };
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

export function login({ email, password, successRoute = '/', errorRoute }) {
  const configuration = resolveConfig({
    method: 'POST',
    data: {
      email,
      password
    }
  });
  return (dispatch) => {
    dispatch(loginRequest());
    Rover.query({ url: 'http://127.0.0.1:3000/api/AuthLogin', configuration })
      .then((data) => {
        const user = {
          email
        };
        localStorage.setItem('token', data.token);
        localStorage.setItem('sessionID', data.sessionID);
        localStorage.setItem('user', user);
        dispatch(loginSuccess(user));
        if (successRoute) {
          dispatch(routeActions.push(successRoute));
        }
      })
      .catch((err) => {
        dispatch(loginFailure(err.message || err.errorMessage));
        if (errorRoute) {
          dispatch(routeActions.push(errorRoute));
        }
      });
  };
}

const killSession = ({ dispatch, successRoute }) => {
  localStorage.removeItem('token');
  localStorage.removeItem('sessionID');
  localStorage.removeItem('user');
  dispatch(logoutSuccess());
  dispatch(routeActions.push(successRoute));
};

export function logout(successRoute = '/') {
  const configuration = resolveConfig({
    method: 'POST'
  });
  return (dispatch) => {
    dispatch(logoutRequest());
    Rover.query({ url: 'http://127.0.0.1:3000/api/AuthLogout', configuration })
      .then(() => killSession({ dispatch, successRoute }))
      .catch(() => killSession({ dispatch, successRoute }));
  };
}
