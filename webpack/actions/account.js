'use strict';

// CREATE_USER
export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

import { Rover } from '../common';

export function createUserRequest(user) {
  return {
    type: CREATE_USER_REQUEST,
    isFetching: true,
    user
  };
};

export function createUserSuccess(user) {
  return {
    type: CREATE_USER_SUCCESS,
    isFetching: false,
    user
  };
};

export function createUserFailure(message) {
  return {
    type: CREATE_USER_FAILURE,
    isFetching: false,
    message
  };
};

export function createUser(credentials) {
  let config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  };
  return (dispatch) => {
    dispatch(createUserRequest(credentials));
    return Rover.rover('http://127.0.0.1:3000/api/AuthCreateUser', config)
      .then((data) => {
        dispatch(createUserSuccess(data));
        return Promise.resolve(data);
      })
      .catch((err) => {
        dispatch(createUserFailure(err.message));
        return Promise.reject(err);
      });
  };
};
