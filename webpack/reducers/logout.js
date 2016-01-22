'use strict';

import { LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE } from '../constants.js';

export default function login(state = {}, action) {
  switch (action.type) {
    case LOGOUT_REQUEST:
      return {};
    case LOGOUT_SUCCESS:
      return {};
    case LOGOUT_FAILURE:
      return {};
    default:
      return state;
  }
}
