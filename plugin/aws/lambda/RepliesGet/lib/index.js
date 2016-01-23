'use strict';

require('babel-core/register');
try {
  require('babel-polyfill');
} catch (e) {}

const pkg = require('../package.json');

const crypto = require('crypto');
const Promise = require('bluebird');
const AWS = require('aws-sdk');

if(process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
}

var DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

exports.handler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);
  context.succeed([{
    title: 'One',
    message: 'This is a reply.'
  }, {
    title: 'Two',
    message: 'This is another reply.'
  }]);
};
