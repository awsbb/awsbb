'use strict';

require('babel-register');
require('babel-polyfill');

const pkg = require('./package.json');

try {
  global.Config = require('./local-config.json');
} catch (e) {
  global.Config = pkg.config;
}

const Hapi = require('hapi');
const WebpackPlugin = require('hapi-webpack-plugin');

const server = new Hapi.Server({
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
  register: require('./server')
}, {
  register: WebpackPlugin,
  options: './webpack.config.js'
}], (err) => {
  if (err) {
    return console.error(err);
  }
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'distribution',
        index: [
          'index.html'
        ]
      }
    }
  });
  server.start(() => {
    console.log('Server running at:', server.info.uri);
  });
});
