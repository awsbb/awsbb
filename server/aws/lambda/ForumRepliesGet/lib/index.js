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
  var data = [{
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
    data: data.filter(function (reply) {
      return reply.threadID === event.params.threadID;
    })
  });
}