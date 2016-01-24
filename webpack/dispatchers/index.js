'use strict';

import * as Constants from '../constants.js';

console.log(Constants);

export function loginRequest(credentials) {
  return {
    type: Constants.LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    credentials
  };
};

export function loginSuccess(user) {
  return {
    type: Constants.LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    token: user.token
  };
};

export function loginFailure(message) {
  return {
    type: Constants.LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  };
};

export function logoutRequest() {
  return {
    type: Constants.LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  };
};

export function logoutSuccess() {
  return {
    type: Constants.LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  };
};

export function dataRequest(config) {
  return {
    type: Constants.DATA_REQUEST,
    isFetching: true,
    config
  };
};

export function dataSuccess(data) {
  return {
    type: Constants.DATA_SUCCESS,
    isFetching: false,
    data
  };
};

export function dataFailure(message) {
  return {
    type: Constants.DATA_FAILURE,
    isFetching: false,
    message
  };
};
