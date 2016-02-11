require('babel-register');
require('babel-polyfill');

const Hapi = require('hapi');
const WebpackPlugin = require('hapi-webpack-plugin');

const inert = require('inert');
const vision = require('vision');
const app = require('./server');

const fs = require('fs');

try {
  fs.accessSync('./config.js', fs.F_OK);
} catch (e) {
  fs.writeFileSync('./config.js', fs.readFileSync('./config.example.js', 'utf8'), 'utf8');
}

const config = require('./config').default;
const keys = Object.keys(config);

keys.forEach((key) => {
  const value = config[key];
  if (value) {
    if (typeof value === 'object') {
      process.env[key] = JSON.stringify(value);
    } else {
      process.env[key] = value;
    }
  }
});

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
  register: inert
}, {
  register: vision
}, {
  register: app
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
    console.log('Server Running @', server.info.uri);
  });
});
