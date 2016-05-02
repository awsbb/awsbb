import { handler as forumCategoriesGet } from '@awsbb/forum-categories-get';

export function setup(server) {
  server.route({
    method: 'GET',
    path: '/api/ForumCategoriesGet',
    config: {
      handler: (request, reply) => {
        forumCategoriesGet(server.getEvent(request), server.getContext(reply));
      }
    }
  });
}
