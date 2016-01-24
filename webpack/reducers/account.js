'use strict';

import { AccountActions } from '../actions';

export default function authorize(state = {
  isFetching: false
}, action) {
  switch (action.type) {
    case AccountActions.CREATE_USER_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.credentials
      });
    case AccountActions.CREATE_USER_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        user: action.user,
        message: ''
      });
    case AccountActions.CREATE_USER_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        message: action.message
      });
    default:
      return state;
  }
};
