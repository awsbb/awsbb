'use strict';

// DATA
export const DATA_REQUEST = 'DATA_REQUEST';
export const DATA_SUCCESS = 'DATA_SUCCESS';
export const DATA_FAILURE = 'DATA_FAILURE';

const configuration = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
};

import { Rover } from '../common';

export function dataRequest(config) {
  return {
    type: DATA_REQUEST,
    isFetching: true,
    config
  };
};

export function dataSuccess(data) {
  return {
    type: DATA_SUCCESS,
    isFetching: false,
    data
  };
};

export function dataFailure(message) {
  return {
    type: DATA_FAILURE,
    isFetching: false,
    message
  };
};

export function ajax(url, config = configuration, authenticated = false) {
  if (authenticated) {
    let token = localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
  }
  return (dispatch) => {
    dispatch(dataRequest(config));
    return Rover.rover(url, config)
      .then((data) => {
        dispatch(dataSuccess(data));
        return Promise.resolve(data);
      })
      .catch((err) => {
        dispatch(dataFailure(err.message));
        return Promise.reject(err);
      });
  };
};
