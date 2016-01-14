'use strict';

var Hapi = require('hapi');

var WebpackPlugin = require('hapi-webpack-plugin');

var server = new Hapi.Server({
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
  register: require('inert')
}, {
  register: require('vision')
}, {
  register: require('./plugin/')
}, {
  register: WebpackPlugin,
  options: './webpack.config.js'
}], function (err) {
  if (err) {
    return console.error(err);
  }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'static',
        index: [
          'index.html'
        ]
      }
    }
  });

  server.start(function () {
    console.log('Server running at:', server.info.uri);
  });
});
