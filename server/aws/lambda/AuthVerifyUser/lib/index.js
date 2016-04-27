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
        var verified = data.Item.verified.BOOL;
        var token = null;
        if (!verified) {
          token = data.Item.verifyToken.S;
        }
        return resolve({
          verified: verified,
          token: token
        });
      }
      reject(boomError({
        message: 'User Not Found',
        code: 404
      }));
    });
  });
};

var updateUser = function updateUser(email) {
  return new _bluebird2.default(function (resolve, reject) {
    DynamoDB.updateItem({
      TableName: 'awsBB_Users',
      Key: {
        email: {
          S: email
        }
      },
      AttributeUpdates: {
        verified: {
          Action: 'PUT',
          Value: {
            BOOL: true
          }
        },
        verifyToken: {
          Action: 'DELETE'
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
  verify: _joi2.default.string().hex().min(2)
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
  var verify = event.payload.verify;

  return validate(event.payload).then(function () {
    return getUserInfo(email);
  }).then(function (_ref2) {
    var verified = _ref2.verified;
    var token = _ref2.token;

    if (verified) {
      return _bluebird2.default.resolve();
    }
    if (verify !== token) {
      return _bluebird2.default.reject(boomError({
        message: 'Invalid Verify Token',
        code: 401
      }));
    }
    return _bluebird2.default.resolve();
  }).then(function () {
    return updateUser(email);
  }).then(function () {
    context.succeed({
      success: true
    });
  }).catch(function (err) {
    context.fail(err);
  });
}