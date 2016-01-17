'use strict';

const GETHandler = require('../aws/handlers/threads-get');

export function setup(server) {
  server.route({
    method: 'GET',
    path: '/api/threads',
    config: {
      handler: (request, reply) => {
        GETHandler.myHandler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
