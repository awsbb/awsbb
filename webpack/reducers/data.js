'use strict';

import { DataActions } from '../actions';

export default function data(state = {
  isFetching: false
}, action) {
  switch (action.type) {
    case DataActions.DATA_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case DataActions.DATA_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        message: '',
        data: action.data
      });
    case DataActions.DATA_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: action.message
      });
    default:
      return state;
  }
};
