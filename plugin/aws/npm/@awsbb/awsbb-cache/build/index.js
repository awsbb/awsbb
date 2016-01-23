'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _catbox = require('catbox');

var _catbox2 = _interopRequireDefault(_catbox);

var _catboxRedis = require('catbox-redis');

var _catboxRedis2 = _interopRequireDefault(_catboxRedis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

try {
  require.resolve('babel-core/register');
} catch (e) {
  require('babel-core/register');
}
try {
  require.resolve('babel-polyfill');
} catch (e) {
  require('babel-polyfill');
}

// the redis cacheClient will connect and partition data in database 0
var cacheClient = null;

var get = function get(id) {
  return new _bluebird2.default(function (resolve, reject) {
    cacheClient.get({
      segment: 'logins',
      id: id
    }, function (err, cached) {
      if (err) {
        return reject(err);
      }
      if (cached && cached.item) {
        return resolve(cached.item);
      }
      resolve();
    });
  });
};

var set = function set(id, value) {
  return new _bluebird2.default(function (resolve, reject) {
    cacheClient.set({
      segment: 'logins',
      id: id
    }, {
      value: value,
      accessed: new Date(_moment2.default.utc().format())
    }, 60 * 1000, function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

exports.default = function () {
  var endpoint = arguments.length <= 0 || arguments[0] === undefined ? '127.0.0.1:6379' : arguments[0];
  var password = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

  cacheClient = new _catbox2.default.Client(_catboxRedis2.default, {
    partition: 'catbox-awsBB',
    host: endpoint.split(':')[0],
    port: endpoint.split(':')[1],
    password: password
  });
  return {
    set: set,
    get: get
  };
};