'use strict';

import * as ForumCategoriesGet from '../aws/lambda/ForumCategoriesGet';

export function setup(server) {
  server.route({
    method: 'GET',
    path: '/api/ForumCategoriesGet',
    config: {
      handler: (request, reply) => {
        ForumCategoriesGet.handler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
