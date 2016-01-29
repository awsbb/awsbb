'use strict';

import { handler as forumRepliesGet } from '../aws/lambda/ForumRepliesGet';

export function setup(server) {
  server.route({
    method: 'GET',
    path: '/api/ForumRepliesGet/{threadID}',
    config: {
      handler: (request, reply) => {
        forumRepliesGet(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
