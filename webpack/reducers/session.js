import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS } from '../constants.js';

export default function authorize(state = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('token') && localStorage.getItem('sessionID') ? true : false,
  user: localStorage.getItem('user') || null
}, { type, data, user, message }) {
  switch (type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        message: '',
        data: '',
        user: ''
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        message: '',
        data,
        user
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        data: '',
        message,
        user: ''
      });
    case LOGOUT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: true,
        data: '',
        message: '',
        user: ''
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        data: '',
        message: '',
        user: ''
      });
    default:
      return state;
  }
}
