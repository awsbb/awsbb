'use strict';

// LOGIN
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
// LOGOUT
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

import { Rover } from '../common';

export function loginRequest(credentials) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    credentials
  };
};

export function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    token: user.token
  };
};

export function loginFailure(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  };
};

export function logoutRequest() {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  };
};

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  };
};

export function login(credentials) {
  let config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  };
  return (dispatch) => {
    dispatch(loginRequest(credentials));
    return Rover.rover('http://127.0.0.1:3000/api/AuthLogin', config)
      .then((data) => {
        localStorage.setItem('token', data.token);
        dispatch(loginSuccess(data));
        return Promise.resolve(data);
      })
      .catch((err) => {
        dispatch(loginFailure(err.message));
        return Promise.reject(err);
      });
  };
};

export function logout() {
  return (dispatch) => {
    dispatch(logoutRequest());
    localStorage.removeItem('token');
    dispatch(logoutSuccess());
    return Promise.resolve();
  };
};
