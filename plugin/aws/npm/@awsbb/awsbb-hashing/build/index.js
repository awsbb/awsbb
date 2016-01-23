'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeHash = computeHash;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

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

var length = 128;
var iterations = 4096;

function computeHash(password, salt) {
  if (salt) {
    return new _bluebird2.default(function (resolve, reject) {
      _crypto2.default.pbkdf2(password, salt, iterations, length, function (err, key) {
        if (err) {
          return reject(err);
        }
        return resolve({
          salt: salt,
          hash: key.toString('base64')
        });
      });
    });
  }
  var randomBytes = new _bluebird2.default(function (resolve, reject) {
    _crypto2.default.randomBytes(length, function (err, salt) {
      if (err) {
        return reject(err);
      }
      salt = salt.toString('base64');
      resolve(salt);
    });
  });
  return randomBytes.then(function (salt) {
    return computeHash(password, salt);
  });
};