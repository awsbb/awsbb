'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = handler;

var _awsbbCache = require('@awsbb/awsbb-cache');

var _awsbbCache2 = _interopRequireDefault(_awsbbCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// the redis cacheClient will connect and partition data in database 0
var cache = new _awsbbCache2.default(process.env.EC_ENDPOINT);

function handler(event, context) {
  var userSessionID = event.headers['x-awsbb-sessionid'];

  return cache.start().then(function () {
    return cache.drop({ segment: 'logins', id: userSessionID });
  }).then(function () {
    context.succeed({
      success: true
    });
  }).catch(function (err) {
    context.fail(err);
  }).finally(function () {
    return cache.stop();
  });
}