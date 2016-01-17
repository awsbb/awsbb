'use strict';

const GETHandler = require('../aws/handlers/categories-get');

export function setup(server) {
  server.route({
    method: 'GET',
    path: '/api/categories',
    config: {
      handler: (request, reply) => {
        GETHandler.myHandler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
