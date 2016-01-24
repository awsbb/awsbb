'use strict';

import * as Constants from '../constants.js';

export default function data(state = {
  isFetching: false
}, action) {
  switch (action.type) {
    case Constants.DATA_REQUEST:
      return Object.assign({}, state, {
        isFetching: false,
        config: action.config
      });
    case Constants.DATA_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.data,
        message: ''
      });
    case Constants.DATA_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: action.message
      });
    default:
      return state;
  }
};
