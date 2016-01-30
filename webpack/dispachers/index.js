import { DATA_REQUEST, DATA_SUCCESS, DATA_FAILURE, DATA_CLEAR } from '../constants.js';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS } from '../constants.js';

export function dataRequest() {
  return {
    type: DATA_REQUEST
  };
}

export function dataSuccess(data) {
  return {
    type: DATA_SUCCESS,
    data
  };
}

export function dataFailure(message) {
  return {
    type: DATA_FAILURE,
    message
  };
}

export function clear() {
  return {
    type: DATA_CLEAR
  };
}

export function loginRequest() {
  return {
    type: LOGIN_REQUEST
  };
}

export function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user
  };
}

export function loginFailure(message) {
  return {
    type: LOGIN_FAILURE,
    message
  };
}

export function logoutRequest() {
  return {
    type: LOGOUT_REQUEST
  };
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  };
}
