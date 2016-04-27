'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = handler;

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

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
        var salt = data.Item.passwordSalt.S;
        var hash = data.Item.passwordHash.S;
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

var updateUser = function updateUser(_ref2) {
  var email = _ref2.email;
  var hash = _ref2.hash;
  var salt = _ref2.salt;

  return new _bluebird2.default(function (resolve, reject) {
    DynamoDB.updateItem({
      TableName: 'awsBB_Users',
      Key: {
        email: {
          S: email
        }
      },
      AttributeUpdates: {
        passwordHash: {
          Action: 'PUT',
          Value: {
            S: hash
          }
        },
        passwordSalt: {
          Action: 'PUT',
          Value: {
            S: salt
          }
        }
      }
    }, function (err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

var joiEventSchema = _joi2.default.object().keys({
  email: _joi2.default.string().email(),
  currentPassword: _joi2.default.string().min(6),
  password: _joi2.default.string().min(6),
  confirmation: _joi2.default.string().min(6)
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
      if (event.password === event.confirmation) {
        return resolve();
      }
      reject(boomError({
        message: 'Invalid Password/Confirmation Combination',
        code: 400
      }));
    });
  });
};

function handler(event, context) {
  var email = event.payload.email;
  var currentPassword = event.payload.currentPassword;
  var password = event.payload.password;

  var userSessionID = event.headers['x-awsbb-sessionid'];

  return cache.start().then(function () {
    return cache.authorizeUser({ userEmail: email, headers: event.headers });
  }).then(function () {
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
    return (0, _awsbbHashing.computeHash)({ password: currentPassword, salt: salt }).then(function (_ref4) {
      var hash = _ref4.hash;

      if (userHash !== hash) {
        return _bluebird2.default.reject(boomError({
          message: 'Invalid Password',
          code: 401
        }));
      }
      return (0, _awsbbHashing.computeHash)({ password: password });
    });
  }).then(function (_ref5) {
    var salt = _ref5.salt;
    var hash = _ref5.hash;
    return updateUser({ email: email, hash: hash, salt: salt });
  }).then(function () {
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