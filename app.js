require('babel-register');
require('babel-polyfill');

const Hapi = require('hapi');
const WebpackPlugin = require('hapi-webpack-plugin');

const path = require('path');
const good = require('good');
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
  register: good,
  options: {
    ops: {
      interval: 15000
    },
    includes: {
      request: [
        'headers',
        'payload'
      ],
      response: [
        'payload'
      ]
    },
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          log: '*',
          error: '*',
          response: '*',
          request: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}, {
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
    console.error(err);
  } else {
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: path.join(__dirname, './distribution'),
          index: true,
          lookupCompressed: true
        }
      }
    });
    server.start(() => {
      console.log('Server Running @', server.info.uri);
    });
  }
});
