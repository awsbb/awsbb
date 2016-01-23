'use strict';

require('babel-core/register');
try {
  require('babel-polyfill');
} catch (e) {}

var pkg = require('../package.json');

var crypto = require('crypto');
var Promise = require('bluebird');
var AWS = require('aws-sdk');

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
    description: 'This is a category.'
  }, {
    title: 'Two',
    description: 'This is another category.'
  }]);
};
