'use strict';

var pkg = require('./package.json');

global.Promise = require('bluebird');
global.Config = pkg.config;

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

exports.handler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);
  context.succeed({
    success: true
  });
};
