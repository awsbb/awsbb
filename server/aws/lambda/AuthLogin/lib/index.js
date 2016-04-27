'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = handler;

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _awsbbHashing = require('@awsbb/awsbb-hashing');

var _awsbbCache = require('@awsbb/awsbb-cache');

var _awsbbCache2 = _interopRequireDefault(_awsbbCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var boomError = function boomError(_ref) {
  var message = _ref.message;
  var _ref$code = _ref.code;
  var code = _ref$code === undefined ? 500 : _ref$code;

  var boomData = _boom2.default.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

// the redis cacheClient will connect and partition data in database 0
var cache = new _awsbbCache2.default({
  endpoint: process.env.EC_ENDPOINT
});

var DynamoDB = new _awsSdk2.default.DynamoDB({
  region: process.env.REGION,
  endpoint: new _awsSdk2.default.Endpoint(process.env.DDB_ENDPOINT)
});

var getUserInfo = function getUserInfo(email) {
  return new _bluebird2.default(function (resolve, reject) {
    DynamoDB.getItem({
      TableName: 'awsBB_Users',
      Key: {
        email: {
          S: email
        }
      }
    }, function (err, data) {
      if (err) {
        return reject(err);
      }
      if (data.Item) {
        var hash = data.Item.passwordHash.S;
        var salt = data.Item.passwordSalt.S;
        var verified = data.Item.verified.BOOL;
        return resolve({
          salt: salt,
          hash: hash,
          verified: verified
        });
      }
      reject(boomError({
        message: 'User Not Found',
        code: 404
      }));
    });
  });
};

var generateToken = function generateToken(_ref2) {
  var email = _ref2.email;
  var _ref2$roles = _ref2.roles;
  var roles = _ref2$roles === undefined ? [] : _ref2$roles;

  var application = 'awsBB';
  var sessionID = _nodeUuid2.default.v4();
  var token = _jsonwebtoken2.default.sign({
    email: email,
    application: application,
    roles: roles,
    sessionID: sessionID
  }, process.env.JWT_SECRET, {
    expiresIn: '12 days'
  });
  return _bluebird2.default.resolve({
    sessionID: sessionID,
    token: token
  });
};

var joiEventSchema = _joi2.default.object().keys({
  email: _joi2.default.string().email(),
  password: _joi2.default.string().min(6)
});

var joiOptions = {
  abortEarly: false
};

var validate = function validate(event) {
  return new _bluebird2.default(function (resolve, reject) {
    _joi2.default.validate(event, joiEventSchema, joiOptions, function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

function handler(event, context) {
  var email = event.payload.email;
  var password = event.payload.password;

  return cache.start().then(function () {
    return validate(event.payload);
  }).then(function () {
    return getUserInfo(email);
  }).then(function (_ref3) {
    var salt = _ref3.salt;
    var hash = _ref3.hash;
    var verified = _ref3.verified;

    if (!verified) {
      return _bluebird2.default.reject(boomError({
        message: 'User Not Verified',
        code: 401
      }));
    }
    var userHash = hash;
    return (0, _awsbbHashing.computeHash)({ password: password, salt: salt }).then(function (_ref4) {
      var hash = _ref4.hash;

      if (userHash !== hash) {
        return _bluebird2.default.reject(boomError({
          message: 'Invalid Password',
          code: 401
        }));
      }
      return _bluebird2.default.resolve();
    });
  }).then(function () {
    return generateToken({ email: email });
  }).then(function (_ref5) {
    var sessionID = _ref5.sessionID;
    var token = _ref5.token;

    return cache.set({ segment: 'logins', id: sessionID, value: token }).then(function () {
      return _bluebird2.default.resolve({
        sessionID: sessionID,
        token: token
      });
    });
  }).then(function (_ref6) {
    var sessionID = _ref6.sessionID;
    var token = _ref6.token;

    context.succeed({
      success: true,
      data: {
        sessionID: sessionID,
        token: token
      }
    });
  }).catch(function (err) {
    context.fail(err);
  }).finally(function () {
    return cache.stop();
  });
}