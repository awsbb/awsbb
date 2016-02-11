import Boom from 'boom';
import crypto from 'crypto';
import Promise from 'bluebird';
import AWS from 'aws-sdk';

const boomError = (message, code = 500) => {
  const boomData = Boom.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

const DynamoDB = new AWS.DynamoDB({
  region: process.env.REGION,
  endpoint: new AWS.Endpoint(process.env.DDB_ENDPOINT)
});

export function handler(event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  context.succeed({
    success: true,
    data: [{
      id: 0,
      title: 'One',
      description: 'This is a category.'
    }, {
      id: 1,
      title: 'Two',
      description: 'This is another category.'
    }]
  });
}
