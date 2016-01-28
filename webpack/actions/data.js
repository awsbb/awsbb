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

// export function getData(url, query = {}, authenticated = false) {
//   let config = {
//     ...configuration
//   };
//   let queryString = Object.keys(query).map((key) => {
//     return key + '=' + query[key];
//   }).join('&');
//   if(queryString) {
//     url += '?' + queryString;
//   }
//   return (dispatch) => new Promise((resolve, reject) => {
//     dispatch(dataRequest());
//     return Rover.rover(url, config, authenticated)
//       .then((data) => {
//         dispatch(dataSuccess());
//         return resolve(data);
//       })
//       .catch((err) => {
//         dispatch(dataFailure(err.message));
//         return reject(err);
//       });
//   });
// };

export function postData(url, data, authenticated = false) {
  let config = {
    ...configuration,
    method: 'POST',
    body: JSON.stringify(data)
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(dataRequest());
    return Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(dataSuccess());
        return resolve(data);
      })
      .catch((err) => {
        dispatch(dataFailure(err.message));
        return reject(err);
      });
  });
};

export function updateData(url, data, authenticated = false) {
  let config = {
    ...configuration,
    method: 'PATCH',
    body: JSON.stringify(data)
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(dataRequest());
    return Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(dataSuccess());
        return resolve(data);
      })
      .catch((err) => {
        console.log(err);
        dispatch(dataFailure(err.message));
        return reject(err);
      });
  });
};

// export function deleteData(url, authenticated = false) {
//   let config = {
//     ...configuration,
//     method: 'DELETE'
//   };
//   return (dispatch) => new Promise((resolve, reject) => {
//     dispatch(dataRequest());
//     return Rover.rover(url, config, authenticated)
//       .then((data) => {
//         dispatch(dataSuccess());
//         return resolve(data);
//       })
//       .catch((err) => {
//         dispatch(dataFailure(err.message));
//         return reject(err);
//       });
//   });
// };
