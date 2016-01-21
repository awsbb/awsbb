'use strict';

var pkg = require('./package.json');

var crypto = require('crypto');

var Promise = require('bluebird');
global.Config = pkg.config;

var AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

exports.handler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);
  context.succeed([{
    title: 'One',
    description: 'This is a thread.'
  }, {
    title: 'Two',
    description: 'This is another thread.'
  }]);
};
