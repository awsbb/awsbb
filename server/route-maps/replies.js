'use strict';

import * as ForumRepliesGet from '../aws/lambda/ForumRepliesGet';

export function setup(server) {
  server.route({
    method: 'GET',
    path: '/api/ForumRepliesGet',
    config: {
      handler: (request, reply) => {
        ForumRepliesGet.handler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
