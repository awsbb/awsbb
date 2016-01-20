'use strict';

const RepliesGet = require('../aws/lambda/RepliesGet');

export function setup(server) {
  server.route({
    method: 'GET',
    path: '/api/RepliesGet',
    config: {
      handler: (request, reply) => {
        RepliesGet.handler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
