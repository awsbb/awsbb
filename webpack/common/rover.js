'use strict';

export function rover(url, config) {
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
