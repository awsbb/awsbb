
import { Rover } from '../common';
import { routeActions } from 'react-router-redux';
import * as SessionActions from './session.js';

export const DATA_REQUEST = 'DATA_REQUEST';
export const DATA_SUCCESS = 'DATA_SUCCESS';
export const DATA_FAILURE = 'DATA_FAILURE';

const dataRequest = () => {
  return {
    type: DATA_REQUEST
  };
};

const dataSuccess = (data) => {
  return {
    type: DATA_SUCCESS,
    data
  };
};

const dataFailure = (message) => {
  return {
    type: DATA_FAILURE,
    message
  };
};

const resolveUrlWithQUery = ({ url, query }) => {
  let result = url;
  const queryString = Object.keys(query).map((key) => {
    return `${key}=${query[key]}`;
  }).join('&');
  if (queryString) {
    result += `?${queryString}`;
  }
  return result;
};

const resolveConfig = ({ method = 'GET', data = {} }) => {
  const config = {
    method
  };
  switch (method.toUpperCase()) {
    case 'GET':
    case 'HEAD':
      break;
    default:
      config.body = JSON.stringify(data);
      break;
  }
  return config;
};

export function queryAPIThenLogout({ method = 'GET', url, query = {}, data = {}, authenticated = false, successRoute, errorRoute }) {
  const resolvedURL = resolveUrlWithQUery({ url, query });
  const configuration = resolveConfig({ method, data });
  return (dispatch) => {
    dispatch(dataRequest());
    Rover.query({ url: resolvedURL, configuration, authenticated })
      .then((data) => {
        dispatch(dataSuccess(data));
        if (successRoute) {
          return dispatch(SessionActions.logout(successRoute));
        }
        dispatch(SessionActions.logout());
      })
      .catch((err) => {
        dispatch(dataFailure(err.message || err.errorMessage));
        if (errorRoute) {
          dispatch(routeActions.push(errorRoute));
        }
      });
  };
}

export function queryAPI({ method = 'GET', url, query = {}, data = {}, authenticated = false, successRoute, errorRoute }) {
  const resolvedURL = resolveUrlWithQUery({ url, query });
  const configuration = resolveConfig({ method, data });
  return (dispatch) => {
    dispatch(dataRequest());
    Rover.query({ url: resolvedURL, configuration, authenticated })
      .then((data) => {
        dispatch(dataSuccess(data));
        if (successRoute) {
          dispatch(routeActions.push(successRoute));
        }
      })
      .catch((err) => {
        dispatch(dataFailure(err.message || err.errorMessage));
        if (errorRoute) {
          dispatch(routeActions.push(errorRoute));
        }
      });
  };
}
