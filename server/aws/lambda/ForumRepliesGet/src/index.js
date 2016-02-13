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
  const data = [{
    id: 0,
    threadID: 0,
    title: 'One',
    description: 'This is a reply for thread One.'
  }, {
    id: 1,
    threadID: 0,
    title: 'Two',
    description: 'This is another reply for thread One.'
  }, {
    id: 2,
    threadID: 1,
    title: 'One',
    description: 'This is a reply for thread Two.'
  }, {
    id: 3,
    threadID: 1,
    title: 'Two',
    description: 'This is another reply for thread Two.'
  }];

  context.succeed({
    success: true,
    data: data.filter((reply) => reply.threadID === event.params.threadID)
  });
}
