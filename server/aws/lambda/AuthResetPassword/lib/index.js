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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var boomError = function boomError(_ref) {
  var message = _ref.message;
  var _ref$code = _ref.code;
  var code = _ref$code === undefined ? 500 : _ref$code;

  var boomData = _boom2.default.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

var DynamoDB = new _awsSdk2.default.DynamoDB({
  region: process.env.REGION,
  endpoint: new _awsSdk2.default.Endpoint(process.env.DDB_ENDPOINT)
});

var getUserToken = function getUserToken(email) {
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
        if (data.Item.lostToken) {
          var token = data.Item.lostToken.S;
          return resolve(token);
        }
        return reject(boomError({
          message: 'User Missing Lost Token',
          code: 401
        }));
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
        },
        lostToken: {
          Action: 'DELETE'
        }
      }
    }, function (err, data) {
      if (err) {
        return reject(err, data);
      }
      resolve(data);
    });
  });
};

var joiEventSchema = _joi2.default.object().keys({
  email: _joi2.default.string().email(),
  lost: _joi2.default.string().hex().min(2),
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
  var lost = event.payload.lost;
  var password = event.payload.password;

  return validate(event.payload).then(function () {
    return getUserToken(email);
  }).then(function (token) {
    if (lost !== token) {
      return _bluebird2.default.reject(boomError({
        message: 'Invalid Lost Token',
        code: 401
      }));
    }
    return _bluebird2.default.resolve();
  }).then(function () {
    return (0, _awsbbHashing.computeHash)({ password: password });
  }).then(function (_ref3) {
    var salt = _ref3.salt;
    var hash = _ref3.hash;
    return updateUser({ email: email, hash: hash, salt: salt });
  }).then(function () {
    context.succeed({
      success: true
    });
  }).catch(function (err) {
    context.fail(err);
  });
}