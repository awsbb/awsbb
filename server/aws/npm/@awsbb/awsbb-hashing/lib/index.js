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

var length = 128;
var iterations = 4096;

function computeHash(_ref) {
  var password = _ref.password;
  var _ref$salt = _ref.salt;
  var salt = _ref$salt === undefined ? _crypto2.default.randomBytes(length).toString('base64') : _ref$salt;

  return new _bluebird2.default(function (resolve) {
    var hash = _crypto2.default.pbkdf2Sync(password, salt, iterations, length).toString('base64');
    resolve({
      salt: salt,
      hash: hash
    });
  });
}