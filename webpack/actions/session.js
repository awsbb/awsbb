'use strict';

// LOGIN
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
// LOGOUT
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

import { Rover } from '../common';

export function loginRequest() {
  return {
    type: LOGIN_REQUEST,
    sessionIsFetching: true,
    isAuthenticated: false
  };
};

export function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    sessionIsFetching: false,
    isAuthenticated: true,
    user: {
      email: user.email
    }
  };
};

export function loginFailure(message) {
  return {
    type: LOGIN_FAILURE,
    sessionIsFetching: false,
    isAuthenticated: false,
    message: message
  };
};

export function logoutRequest() {
  return {
    type: LOGOUT_REQUEST,
    sessionIsFetching: true,
    isAuthenticated: true
  };
};

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
    sessionIsFetching: false,
    isAuthenticated: false
  };
};

export function login(credentials) {
  let config = {
    method: 'POST',
    body: JSON.stringify(credentials)
  };
  return (dispatch) => {
    dispatch(loginRequest());
    Rover.rover('http://127.0.0.1:3000/api/AuthLogin', config)
      .then((data) => {
        let user = {
          email: credentials.email
        };
        localStorage.setItem('token', data.token);
        localStorage.setItem('sessionID', data.sessionID);
        localStorage.setItem('user', user);
        dispatch(loginSuccess(user));
      })
      .catch((err) => {
        dispatch(loginFailure(err.message || err.errorMessage));
      });
  };
};

export function logout() {
  return (dispatch) => {
    dispatch(logoutRequest());
    localStorage.removeItem('token');
    localStorage.removeItem('sessionID');
    localStorage.removeItem('user');
    dispatch(logoutSuccess());
  };
};
