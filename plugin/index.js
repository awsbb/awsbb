'use strict';

var pkg = require('../package.json');

exports.register = function (server, options, next) {
  server.path(__dirname);

  server.getEvent = function (request) {
    return {
      payload: request.payload,
      headers: request.headers,
      method: request.method,
      params: request.params,
      query: request.query
    };
  };

  server.getContext = function (reply) {
    return {
      succeed: function (data) {
        reply(data);
      },
      fail: function (data) {
        reply(data).code(500);
      }
    };
  };

  next();
};

exports.register.attributes = {
  pkg: pkg
};
