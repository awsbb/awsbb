import { Rover } from '../common';
import { SessionDispatchers } from '../dispachers';

export function login({ email, password }) {
  const config = {
    method: 'POST',
    body: JSON.stringify({ email, password })
  };
  return (dispatch) => {
    dispatch(SessionDispatchers.loginRequest());
    Rover.rover('http://127.0.0.1:3000/api/AuthLogin', config)
      .then((data) => {
        const user = {
          email
        };
        const responseData = data.data;
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('sessionID', responseData.sessionID);
        localStorage.setItem('user', user);
        dispatch(SessionDispatchers.loginSuccess({ data, user }));
      })
      .catch((err) => {
        dispatch(SessionDispatchers.loginFailure(err.message || err.errorMessage));
      });
  };
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
