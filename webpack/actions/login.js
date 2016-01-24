'use strict';

import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../constants.js';

// DIPSATCHERS
function requestLogin(credentials) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    credentials
  };
}

function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    token: user.token
  };
}

function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  };
}

export function login(credentials) {
  let config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  };
  return (dispatch) => {
    dispatch(requestLogin(credentials));
    return fetch('http://127.0.0.1:3000/api/AuthLogin', config)
      .then((response) => {
        return response.json()
          .then((user) => ({ user, response }))
          .then(({ user, response }) => {
            if (response.ok) {
              localStorage.setItem('token', user.token);
              dispatch(receiveLogin(user));
              return Promise.resolve();
            }
            dispatch(loginError(user.message));
            return Promise.reject(user);
          });
      });
  };
};
