import { Rover } from '../common';
import { SessionDispatchers } from '../dispachers';

export function login(credentials) {
  const config = {
    method: 'POST',
    body: JSON.stringify(credentials)
  };
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(SessionDispatchers.loginRequest());
    return Rover.rover('http://127.0.0.1:3000/api/AuthLogin', config)
      .then((data) => {
        const user = {
          email: credentials.email
        };
        localStorage.setItem('token', data.token);
        localStorage.setItem('sessionID', data.sessionID);
        localStorage.setItem('user', user);
        dispatch(SessionDispatchers.loginSuccess(user));
        resolve(user);
      })
      .catch((err) => {
        dispatch(SessionDispatchers.loginFailure(err.message || err.errorMessage));
        reject(err);
      });
  });
}

export function logout() {
  return (dispatch) => new Promise((resolve) => {
    dispatch(SessionDispatchers.logoutRequest());
    localStorage.removeItem('token');
    localStorage.removeItem('sessionID');
    localStorage.removeItem('user');
    dispatch(SessionDispatchers.logoutSuccess());
    resolve();
  });
}
