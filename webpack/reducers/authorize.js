'use strict';

import * as Constants from '../constants.js';

export default function authorize(state = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('token') ? true : false
}, action) {
  switch (action.type) {
    case Constants.LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        user: action.credentials
      });
    case Constants.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        user: action.user,
        message: ''
      });
    case Constants.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        message: action.message
      });
    case Constants.LOGOUT_REQUEST:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        message: ''
      });
    case Constants.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false
      });
    default:
      return state;
  }
};
