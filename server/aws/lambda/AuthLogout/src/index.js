import pkg from '../package.json';

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
}

import Cache from '@awsbb/awsbb-cache';

// the redis cacheClient will connect and partition data in database 0
const cache = new Cache(Config.AWS.EC_ENDPOINT);

export function handler(event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  const userSessionID = event.headers['x-awsbb-sessionid'];

  return cache.start()
    .then(() => cache.drop('logins', userSessionID))
    .then(() => {
      context.succeed({
        success: true
      });
    })
    .catch((err) => {
      context.fail(err);
    })
    .finally(() => {
      return cache.stop();
    });
}
