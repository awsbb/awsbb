import { DATA_REQUEST, DATA_SUCCESS, DATA_FAILURE } from '../constants.js';

export function dataRequest() {
  return {
    type: DATA_REQUEST,
    isFetching: true
  };
}

export function dataSuccess(data) {
  return {
    type: DATA_SUCCESS,
    isFetching: false,
    data
  };
}

export function dataFailure(message) {
  return {
    type: DATA_FAILURE,
    isFetching: false,
    message: message
  };
}
