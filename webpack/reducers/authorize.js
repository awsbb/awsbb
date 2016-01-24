'use strict';

import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE } from '../constants.js';

export default function authorize(state = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('token') ? true : false
}, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        user: action.credentials
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        message: ''
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        message: action.message
      });
    case LOGOUT_REQUEST:
      return {};
    case LOGOUT_SUCCESS:
      return {};
    case LOGOUT_FAILURE:
      return {};
    default:
      return state;
  }
};
