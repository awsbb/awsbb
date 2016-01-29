'use strict';

// DATA
export const DATA_REQUEST = 'DATA_REQUEST';
export const DATA_SUCCESS = 'DATA_SUCCESS';
export const DATA_FAILURE = 'DATA_FAILURE';

import { Rover } from '../common';

export function dataRequest() {
  return {
    type: DATA_REQUEST,
    isFetching: true
  };
};

export function dataSuccess() {
  return {
    type: DATA_SUCCESS,
    isFetching: false
  };
};

export function dataFailure(message) {
  return {
    type: DATA_FAILURE,
    isFetching: false,
    message: message
  };
};

export function getData(url, query = {}, authenticated = false) {
  let queryString = Object.keys(query).map((key) => {
    return key + '=' + query[key];
  }).join('&');
  if (queryString) {
    url += '?' + queryString;
  }
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(dataRequest());
    return Rover.rover(url, {}, authenticated)
      .then((data) => {
        dispatch(dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        dispatch(dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
};

export function postData(url, data, authenticated = false) {
  let config = {
    method: 'POST',
    body: JSON.stringify(data)
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(dataRequest());
    return Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        dispatch(dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
};

export function updateData(url, data, authenticated = false) {
  let config = {
    method: 'PATCH',
    body: JSON.stringify(data)
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(dataRequest());
    return Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        dispatch(dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
};

export function deleteData(url, authenticated = false) {
  let config = {
    method: 'DELETE'
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(dataRequest());
    return Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        dispatch(dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
};
