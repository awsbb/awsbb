export function rover(url, configuration = {}, authenticated = false) {
  const sessionID = localStorage.getItem('sessionID');
  const token = localStorage.getItem('token');
  const config = {
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
        .then((data) => ({ data, response }))
        .then(({ data, response }) => {
          console.log(response);
          if (response.ok) {
            if (data.success) {
              return Promise.resolve(data);
            }
            try {
              data.errorMessage = JSON.parse(data.errorMessage);
            } catch (e) {
              const message = data.errorMessage.toLowerCase();
              switch (message) {
                case 'the conditional request failed':
                  data.errorMessage = {
                    error: 'Error',
                    message: 'A Server Condition Was Not Met (Duplicate Data?)'
                  };
                  break;
                default:
                  data.errorMessage = {
                    error: 'Internal Server Error',
                    message: data.errorMessage
                  };
                  break;
              }
            }
            return Promise.reject(data);
          }
          return Promise.reject(data);
        });
    });
}
