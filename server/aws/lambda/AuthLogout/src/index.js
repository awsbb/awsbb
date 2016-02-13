import Cache from '@awsbb/awsbb-cache';

// the redis cacheClient will connect and partition data in database 0
const cache = new Cache(process.env.EC_ENDPOINT);

export function handler(event, context) {
  const userSessionID = event.headers['x-awsbb-sessionid'];

  return cache.start()
    .then(() => cache.drop({ segment: 'logins', id: userSessionID}))
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
