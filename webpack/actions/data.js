import { Rover } from '../common';
import { DataDispatchers } from '../dispachers';

export function getAPI({ url, query = {}, authenticated = false }) {
  const queryString = Object.keys(query).map((key) => {
    return `${key}=${query[key]}`;
  }).join('&');
  if (queryString) {
    url += `?${queryString}`;
  }
  return (dispatch) => {
    dispatch(DataDispatchers.dataRequest());
    Rover.rover(url, {}, authenticated)
      .then((data) => dispatch(DataDispatchers.dataSuccess(data)))
      .catch((err) => dispatch(DataDispatchers.dataFailure(err.message || err.errorMessage)));
  };
}

export function postAPI({ url, data, authenticated = false }) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data)
  };
  return (dispatch) => {
    dispatch(DataDispatchers.dataRequest());
    Rover.rover(url, config, authenticated)
      .then((data) => dispatch(DataDispatchers.dataSuccess(data)))
      .catch((err) => dispatch(DataDispatchers.dataFailure(err.message || err.errorMessage)));
  };
}

export function patchAPI({ url, data, authenticated = false }) {
  const config = {
    method: 'PATCH',
    body: JSON.stringify(data)
  };
  return (dispatch) => {
    dispatch(DataDispatchers.dataRequest());
    Rover.rover(url, config, authenticated)
      .then((data) => dispatch(DataDispatchers.dataSuccess(data)))
      .catch((err) => dispatch(DataDispatchers.dataFailure(err.message || err.errorMessage)));
  };
}

export function deleteAPI({ url, authenticated = false }) {
  const config = {
    method: 'DELETE'
  };
  return (dispatch) => {
    dispatch(DataDispatchers.dataRequest());
    Rover.rover(url, config, authenticated)
      .then((data) => dispatch(DataDispatchers.dataSuccess(data)))
      .catch((err) => dispatch(DataDispatchers.dataFailure(err.message || err.errorMessage)));
  };
}

export function clear() {
  return (dispatch) => {
    dispatch(DataDispatchers.clear());
  };
}
