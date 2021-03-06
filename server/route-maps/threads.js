import { handler as forumThreadsGet } from '@awsbb/forum-threads-get';

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
}
