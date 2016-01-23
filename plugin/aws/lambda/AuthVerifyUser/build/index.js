'use strict';

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

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

if (process.env.NODE_ENV === 'production') {
  global.Config = _package2.default.config;
}

var DynamoDB = new _awsSdk2.default.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new _awsSdk2.default.Endpoint(Config.AWS.DDB_ENDPOINT)
});

var getUser = function getUser(email) {
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
      reject(new Error('UserNotFound'));
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

exports.handler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  var email = event.payload.email;
  var verify = event.payload.verify;

  return validate(event.payload).then(function () {
    return getUser(email);
  }).then(function (result) {
    console.log(result);
    if (result.verified) {
      return _bluebird2.default.resolve(result);
    }
    if (verify !== result.token) {
      return _bluebird2.default.reject(new Error('InvalidVerifyUserToken'));
    }
    return updateUser(email);
  }).then(function (result) {
    console.log(result);
    context.succeed({
      success: true
    });
  }).catch(function (err) {
    console.log(err);
    context.fail({
      success: false,
      message: err.message
    });
  });
};