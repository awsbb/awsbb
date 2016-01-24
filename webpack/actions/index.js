'use strict';

import * as dispatchers from '../dispatchers';

const rover = (url, config) => {
  return fetch(url, config)
    .then((response) => {
      return response.json()
        .then((data) => ({
          data, response
        }))
        .then(({
          data, response
        }) => {
          if (response.ok) {
            return Promise.resolve(data);
          }
          return Promise.reject(data);
        });
    });
};

export function login(credentials) {
  let config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  };
  return (dispatch) => {
    dispatch(dispatchers.loginRequest(credentials));
    return rover('http://127.0.0.1:3000/api/AuthLogin', config)
      .then((data) => {
        localStorage.setItem('token', data.token);
        dispatch(dispatchers.loginSuccess(data));
        return Promise.resolve(data);
      })
      .catch((err) => {
        dispatch(dispatchers.loginFailure(err.message));
        return Promise.reject(err);
      });
  };
};

export function logout() {
  return (dispatch) => {
    dispatch(dispatchers.logoutRequest());
    localStorage.removeItem('token');
    dispatch(dispatchers.logoutSuccess());
    return Promise.resolve();
  };
};

export function fetch(url, config = {}) {
  return (dispatch) => {
    dispatch(dispatchers.dataRequest(config));
    return rover(url, config)
      .then((data) => {
        dispatch(dispatchers.dataSuccess(data));
        return Promise.resolve(data);
      })
      .catch((err) => {
        dispatch(dispatchers.dataFailure(err.message));
        return Promise.reject(err);
      });
  };
};
