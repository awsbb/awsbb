
import { Rover } from '../common';
import * as Dispatchers from '../dispachers';

export function getAPI({ url, query = {}, authenticated = false }) {
  const queryString = Object.keys(query).map((key) => {
    return `${key}=${query[key]}`;
  }).join('&');
  if (queryString) {
    url += `?${queryString}`;
  }
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(Dispatchers.dataRequest());
    return Rover.rover(url, {}, authenticated)
      .then((data) => {
        dispatch(Dispatchers.dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        dispatch(Dispatchers.dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
}

export function postAPI({ url, data, authenticated = false }) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data)
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(Dispatchers.dataRequest());
    return Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(Dispatchers.dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        dispatch(Dispatchers.dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
}

export function patchAPI({ url, data, authenticated = false }) {
  const config = {
    method: 'PATCH',
    body: JSON.stringify(data)
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(Dispatchers.dataRequest());
    return Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(Dispatchers.dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        dispatch(Dispatchers.dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
}

export function deleteAPI({ url, authenticated = false }) {
  const config = {
    method: 'DELETE'
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(Dispatchers.dataRequest());
    return Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(Dispatchers.dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        dispatch(Dispatchers.dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
}

export function clear() {
  return (dispatch) => new Promise((resolve) => {
    dispatch(Dispatchers.clear());
    resolve();
  });
}

export function login({ email, password }) {
  const config = {
    method: 'POST',
    body: JSON.stringify({ email, password })
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(Dispatchers.loginRequest());
    return Rover.rover('http://127.0.0.1:3000/api/AuthLogin', config)
      .then((data) => {
        const user = {
          email
        };
        const responseData = data.data;
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('sessionID', responseData.sessionID);
        localStorage.setItem('user', user);
        dispatch(Dispatchers.loginSuccess(user));
        resolve(user);
      })
      .catch((err) => {
        dispatch(Dispatchers.loginFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
}

export function logout() {
  return (dispatch) => new Promise((resolve) => {
    dispatch(Dispatchers.logoutRequest());
    localStorage.removeItem('token');
    localStorage.removeItem('sessionID');
    localStorage.removeItem('user');
    dispatch(Dispatchers.logoutSuccess());
    resolve();
  });
}
