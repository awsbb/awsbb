'use strict';

import { SessionActions } from '../actions';

export default function authorize(state = {
  sessionIsFetching: false,
  isAuthenticated: localStorage.getItem('token') && localStorage.getItem('sessionID') ? true : false,
  user: localStorage.getItem('user') || null
}, action) {
  switch (action.type) {
    case SessionActions.LOGIN_REQUEST:
      return Object.assign({}, state, {
        sessionIsFetching: true,
        isAuthenticated: false
      });
    case SessionActions.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        sessionIsFetching: false,
        isAuthenticated: true,
        user: action.user,
        message: ''
      });
    case SessionActions.LOGIN_FAILURE:
      return Object.assign({}, state, {
        sessionIsFetching: false,
        isAuthenticated: false,
        message: action.message
      });
    case SessionActions.LOGOUT_REQUEST:
      return Object.assign({}, state, {
        sessionIsFetching: true,
        isAuthenticated: true
      });
    case SessionActions.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        sessionIsFetching: false,
        isAuthenticated: false,
        user: null,
        message: ''
      });
    default:
      return state;
  }
};
