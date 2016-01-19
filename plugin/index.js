'use strict';

const pkg = require('../package.json');
var _ = require('underscore');
var DefaultHeaders = 'authorization, content-type, if-none-match'.split(', ');

exports.register = (server, options, next) => {
  server.path(__dirname);

  server.getEvent = (request) => {
    return {
      payload: request.payload,
      headers: request.headers,
      method: request.method,
      params: request.params,
      query: request.query
    };
  };

  server.getContext = (reply) => {
    return {
      succeed: (data) => {
        reply(data);
      },
      fail: (data) => {
        reply(data).code(500);
      }
    };
  };

  // AJAX CALLS
  server.route({
    method: 'OPTIONS',
    path: '/api/{param*}',
    config: {
      auth: false,
      handler: function (request, reply) {
        var requestHeaders = [];
        if (request.headers['access-control-request-headers']) {
          requestHeaders = request.headers['access-control-request-headers'].split(', ');
        }
        reply().type('text/plain')
          .header('Access-Control-Allow-Headers', _.union(DefaultHeaders, requestHeaders).join(', '));
      }
    }
  });

  var router = require('./router.js');
  router.mapRoutes(server)
    .then(() => {
      process.nextTick(function () {
        next();
      });
    })
    .catch((err) => {
      process.nextTick(function () {
        next(err);
      });
    });
};

exports.register.attributes = {
  pkg: pkg
};
