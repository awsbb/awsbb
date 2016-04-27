'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = handler;

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var boomError = function boomError(message) {
  var code = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];

  var boomData = _boom2.default.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

var DynamoDB = new _awsSdk2.default.DynamoDB({
  region: process.env.REGION,
  endpoint: new _awsSdk2.default.Endpoint(process.env.DDB_ENDPOINT)
});

function handler(event, context) {
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