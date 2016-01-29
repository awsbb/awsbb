'use strict';

export function rover(url, configuration = {}, authenticated = false) {
  let sessionID = localStorage.getItem('sessionID');
  let token = localStorage.getItem('token');
  let config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    ...configuration
  };
  if (sessionID) {
    config.headers['X-awsBB-SessionID'] = `${sessionID}`;
  }
  if (authenticated) {
    config.headers.Authorization = `Bearer ${token}`;
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
            if (data.success) {
              return Promise.resolve(data);
            }
            return Promise.reject(data);
          }
          return Promise.reject(data);
        });
    });
};
