import { DATA_REQUEST, DATA_SUCCESS, DATA_FAILURE, DATA_CLEAR } from '../constants.js';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS } from '../constants.js';

const store = (state = {
  isFetching: false,
  isAuthenticated: false
}, { type, user, data, message }) => {
  switch (type) {
    // DATA API ACCESS
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
        data
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
    // SESSION CONTROL
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        message: '',
        user: ''
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        message: '',
        user
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        message,
        user: ''
      });
    case LOGOUT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: true,
        message: '',
        user: ''
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        message: '',
        user: ''
      });
    default:
      return state;
  }
};

export default {
  store
};
