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

require('babel-core/register');
try {
  require('babel-polyfill');
} catch (e) {}

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
        var hash = data.Item.passwordHash.S;
        var salt = data.Item.passwordSalt.S;
        var verified = data.Item.verified.BOOL;
        return resolve({
          hash: hash,
          salt: salt,
          verified: verified
        });
      }
      reject(new Error('UserNotFound'));
    });
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

exports.handler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  var email = event.payload.email;
  var password = event.payload.password;

  validate(event.payload).then(function () {
    getUser(email).then(function (getUserResult) {
      console.log(getUserResult);
      if (!getUserResult.hash) {
        return context.fail({
          success: false,
          message: 'UserHasNoHash'
        });
      }
      if (!getUserResult.verified) {
        return context.fail({
          success: false,
          message: 'UserNotVerified'
        });
      }
      computeHash(password, getUserResult.salt).then(function (computeHashResult) {
        console.log(computeHashResult);
        if (getUserResult.hash !== computeHashResult.hash) {
          return context.fail({
            success: false,
            message: 'IncorrectPassword'
          });
        }
        // TODO: Create AuthBearer Token and store in caching system
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
    }).catch(function (err) {
      console.log(err);
      context.fail({
        success: false,
        message: err.message
      });
    });
  }).catch(function (err) {
    console.log(err);
    context.fail({
      success: false,
      message: err.message
    });
  });
};