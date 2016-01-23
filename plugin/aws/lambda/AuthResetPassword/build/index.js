'use strict';

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

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

var length = 128;
var iterations = 4096;

var computeHash = function computeHash(password, salt) {
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
        if (data.Item.lostToken) {
          var token = data.Item.lostToken.S;
          return resolve(token);
        }
        return reject(new Error('UserHasNoLostToken'));
      }
      reject(new Error('UserNotFound'));
    });
  });
};

var updateUser = function updateUser(email, hash, salt) {
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

exports.handler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  var email = event.payload.email;
  var lost = event.payload.lost;
  var password = event.payload.password;

  return validate(event.payload).then(function () {
    return getUser(email);
  }).then(function (token) {
    console.log(token);
    if (lost !== token) {
      return _bluebird2.default.reject(new Error('InvalidResetPasswordToken'));
    }
    return computeHash(password);
  }).then(function (computeHashResult) {
    return updateUser(email, computeHashResult.hash, computeHashResult.salt);
  }).then(function (updateUserResult) {
    console.log(updateUserResult);
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