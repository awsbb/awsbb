import * as Actions from '../actions/session.js';

const initialState = {
  isFetching: false,
  isAuthenticated: false
};

export default function session(state = initialState, { type, user, message }) {
  switch (type) {
    // SESSION CONTROL
    case Actions.LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        message: '',
        user: ''
      });
    case Actions.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        message: '',
        user
      });
    case Actions.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        message,
        user: ''
      });
    case Actions.LOGOUT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: true,
        message: '',
        user: ''
      });
    case Actions.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        message: '',
        user: ''
      });
    default:
      return state;
  }
}
