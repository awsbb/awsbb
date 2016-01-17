'use strict';

const GETHandler = require('../aws/handlers/replies-get');

export function setup(server) {
  server.route({
    method: 'GET',
    path: '/api/replies',
    config: {
      handler: (request, reply) => {
        GETHandler.myHandler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
