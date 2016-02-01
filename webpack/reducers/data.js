import * as Actions from '../actions/data.js';

const initialState = {
  isFetching: false,
  isAuthenticated: false
};

export default function data(state = initialState, { type, data, message }) {
  switch (type) {
    // DATA API ACCESS
    case Actions.DATA_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        message: '',
        data: ''
      });
    case Actions.DATA_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        message: '',
        data
      });
    case Actions.DATA_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message,
        data: ''
      });
    case Actions.DATA_CLEAR:
      return Object.assign({}, state, {
        isFetching: false,
        message: '',
        data: ''
      });
    default:
      return state;
  }
}
