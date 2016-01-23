'use strict';

import CategoriesGet from '../aws/lambda/CategoriesGet';

export function setup(server) {
  server.route({
    method: 'GET',
    path: '/api/CategoriesGet',
    config: {
      handler: (request, reply) => {
        CategoriesGet.handler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
