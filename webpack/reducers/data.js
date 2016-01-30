import { DATA_REQUEST, DATA_SUCCESS, DATA_FAILURE, DATA_CLEAR } from '../constants.js';

export default function data(state = {
  isFetching: false
}, { type, data, message }) {
  switch (type) {
    case DATA_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        message: '',
        data: ''
      });
    case DATA_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        message: '',
        data: data
      });
    case DATA_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message,
        data: ''
      });
    case DATA_CLEAR:
      return Object.assign({}, state, {
        isFetching: false,
        message: '',
        data: ''
      });
    default:
      return state;
  }
}
