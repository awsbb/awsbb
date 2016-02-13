const Hapi = require('hapi');

const path = require('path');
const inert = require('inert');

const server = new Hapi.Server({
  debug: {
    request: ['*']
  },
  connections: {
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    },
    routes: {
      cors: {
        credentials: true
      },
      cache: {
        privacy: 'private'
      },
      security: {
        xframe: false
      },
      files: {
        relativeTo: __dirname
      },
      validate: {
        options: {
          allowUnknown: true,
          abortEarly: false
        }
      },
      response: {
        modify: true,
        options: {
          stripUnknown: true,
          abortEarly: false
        }
      }
    }
  }
});

server.connection({
  host: '127.0.0.1',
  port: 3000
});

server.register([{
  register: inert
}], (err) => {
  if (err) {
    return console.error(err);
  }
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, './'),
        index: true,
        lookupCompressed: true
      }
    }
  });
  server.start(() => {
    console.log('Server Running @', server.info.uri);
  });
});
