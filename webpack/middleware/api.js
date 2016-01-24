'use strict';

const BASE_URL = 'http://127.0.0.1:3000/api/'

function call(endpoint, authenticated) {
  let token = localStorage.getItem('token');
  let config = {};
  if (authenticated) {
    if (token) {
      config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
    } else {
      return Promise.reject(new Error('NoTokenSaved'));
    }
  }
  return fetch(BASE_URL + endpoint, config)
    .then((response) => {
      return response.text()
        .then((data) => ({ data, response }))
        .then(({ data, response }) => {
          if (response.ok) {
            return Promise.resolve(data);
          }
          return Promise.reject(data);
        });
    });
}

export const CALL_API = Symbol('Call API');

export default store => next => action => {
  const CALLAPI = action[CALL_API];

  if (typeof CALLAPI === 'undefined') {
    return next(action);
  }

  let { endpoint, types, authenticated } = CALLAPI;
  const [REQUEST_TYPE, SUCCESS_TYPE, ERROR_TYPE] = types;

  return call(endpoint, authenticated)
    .then((response) => next({
      response,
      authenticated,
      type: SUCCESS_TYPE
    }), (error) => next({
      error: error.message || 'UNKNOWN_HTTP_ERROR',
      type: ERROR_TYPE
    }));
};
