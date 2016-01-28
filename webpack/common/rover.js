'use strict';

export function rover(url, config, authenticated = false) {
  let sessionID = localStorage.getItem('sessionID');
  if (sessionID) {
    config.headers = {
      ...config.headers,
      'X-awsBB-SessionID': `${sessionID}`
    };
  }
  if (authenticated) {
    let token = localStorage.getItem('token');
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
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
