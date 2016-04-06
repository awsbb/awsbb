export function query({ url, configuration = {}, authenticated = false }) {
  const sessionID = localStorage.getItem('sessionID');
  const token = localStorage.getItem('token');
  const config = {
    method: 'GET',
    headers: {},
    ...configuration
  };
  config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json; charset=utf-8';
  if (sessionID) {
    config.headers['X-awsBB-SessionID'] = `${sessionID}`;
  }
  if (authenticated) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, config)
    .then((response) => {
      return response.json()
        .then((data) => ({ data, response }))
        .then(({ data, response }) => {
          if (response.ok) {
            if (data.success) {
              return Promise.resolve(data.data);
            }
            let error = {};
            try {
              error = JSON.parse(data.errorMessage);
            } catch (e) {
              const message = data.errorMessage.toLowerCase();
              switch (message) {
                case 'the conditional request failed':
                  error = {
                    error: 'Error',
                    message: 'A Server Condition Was Not Met (Duplicate Data?)'
                  };
                  break;
                default:
                  error = {
                    error: 'Internal Server Error',
                    message: data.errorMessage
                  };
                  break;
              }
            }
            return Promise.reject(error);
          }
          return Promise.reject(data);
        });
    });
}
