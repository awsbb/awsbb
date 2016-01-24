'use strict';

import { AuthorizeActions } from '../actions';

export default function authorize(state = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('token') ? true : false
}, action) {
  switch (action.type) {
    case AuthorizeActions.LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.credentials
      });
    case AuthorizeActions.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        user: action.user,
        message: ''
      });
    case AuthorizeActions.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        message: action.message
      });
    case AuthorizeActions.LOGOUT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: true,
        message: ''
      });
    case AuthorizeActions.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false
      });
    default:
      return state;
  }
};
