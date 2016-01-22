'use strict';

// import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../constants.js';

export default function authorize(state = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('userToken') ? true : false
}, action) {
  switch (action.type) {
    default:
      return state;
  }
}
