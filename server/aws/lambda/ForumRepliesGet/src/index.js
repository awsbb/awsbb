'use strict';

import pkg from '../package.json';

import crypto from 'crypto';
import Promise from 'bluebird';
import AWS from 'aws-sdk';

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
}

const DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

export function handler(event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  let data = [{
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
};
