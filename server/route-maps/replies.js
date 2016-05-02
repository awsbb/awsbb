import { handler as forumRepliesGet } from '@awsbb/forum-replies-get';

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
}
