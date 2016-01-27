'use strict';

import * as ForumThreadsGet from '../aws/lambda/ForumThreadsGet';

export function setup(server) {
  server.route({
    method: 'GET',
    path: '/api/ForumThreadsGet',
    config: {
      handler: (request, reply) => {
        ForumThreadsGet.handler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
