'use strict';

try {
  require('babel-register');
} catch (e) {}
try {
  require('babel-polyfill');
} catch (e) {}

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

  context.succeed([{
    title: 'One',
    description: 'This is a category.'
  }, {
    title: 'Two',
    description: 'This is another category.'
  }]);
};
