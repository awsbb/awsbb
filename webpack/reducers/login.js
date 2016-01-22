'use strict';

import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../constants.js';

export default function login(state = {}, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {};
    case LOGIN_SUCCESS:
      return {};
    case LOGIN_FAILURE:
      return {};
    default:
      return state;
  }
}
