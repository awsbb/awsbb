import { Rover } from '../common';
import { DataDispatchers } from '../dispachers';

export function getData(url, query = {}, authenticated = false) {
  const queryString = Object.keys(query).map((key) => {
    return `${key}=${query[key]}`;
  }).join('&');
  if (queryString) {
    url += `?${queryString}`;
  }
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(DataDispatchers.dataRequest());
    return Rover.rover(url, {}, authenticated)
      .then((data) => {
        dispatch(DataDispatchers.dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        dispatch(DataDispatchers.dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
}

export function postData(url, data, authenticated = false) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data)
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(DataDispatchers.dataRequest());
    return Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(DataDispatchers.dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        dispatch(DataDispatchers.dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
}

export function updateData(url, data, authenticated = false) {
  const config = {
    method: 'PATCH',
    body: JSON.stringify(data)
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(DataDispatchers.dataRequest());
    return Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(DataDispatchers.dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        dispatch(DataDispatchers.dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
}

export function deleteData(url, authenticated = false) {
  const config = {
    method: 'DELETE'
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(DataDispatchers.dataRequest());
    return Rover.rover(url, config, authenticated)
      .then((data) => {
        dispatch(DataDispatchers.dataSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        dispatch(DataDispatchers.dataFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
}
