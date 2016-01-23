'use strict';

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-core/register');
try {
  require('babel-polyfill');
} catch (e) {}

if (process.env.NODE_ENV === 'production') {
  global.Config = _package2.default.config;
}

var DynamoDB = new _awsSdk2.default.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new _awsSdk2.default.Endpoint(Config.AWS.DDB_ENDPOINT)
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