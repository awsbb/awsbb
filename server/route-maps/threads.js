'use strict';

import { handler as forumThreadsGet } from '../aws/lambda/ForumThreadsGet';

export function setup(server) {
  server.route({
    method: 'GET',
    path: '/api/ForumThreadsGet/{categoryID}',
    config: {
      handler: (request, reply) => {
        forumThreadsGet(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
