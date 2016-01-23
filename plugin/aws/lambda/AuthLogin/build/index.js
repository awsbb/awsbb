'use strict';

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _catbox = require('catbox');

var _catbox2 = _interopRequireDefault(_catbox);

var _catboxRedis = require('catbox-redis');

var _catboxRedis2 = _interopRequireDefault(_catboxRedis);

var _awsbbHashing = require('@awsbb/awsbb-hashing');

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

console.log(_awsbbHashing.computeHash);

if (process.env.NODE_ENV === 'production') {
  global.Config = _package2.default.config;
}

// the redis cacheClient will connect and partition data in database 0
var cacheClient = new _catbox2.default.Client(_catboxRedis2.default, {
  partition: 'catbox-awsBB',
  host: Config.AWS.EC_ENDPOINT.split(':')[0],
  port: Config.AWS.EC_ENDPOINT.split(':')[1],
  password: ''
});

var cache = {
  get: function get(id) {
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
  },
  set: function set(id, value) {
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
  }
};

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

var generateToken = function generateToken(email) {
  return new _bluebird2.default(function (resolve, reject) {
    var token = _jsonwebtoken2.default.sign({
      email: email,
      application: 'awsBB'
    }, Config.JWT_SECRET);
    cache.set(email, token).then(function () {
      resolve(token);
    }).catch(function (err) {
      reject(err);
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
  // let userToken = event.headers['X-awsBB-User-Token'];

  cacheClient.start(function (err) {
    if (err) {
      return context.fail({
        success: false,
        message: err.message
      });
    }
    return validate(event.payload).then(function () {
      return getUser(email);
    }).then(function (getUserResult) {
      console.log(getUserResult);
      if (!getUserResult.hash) {
        return _bluebird2.default.reject(new Error('UserHasNoHash'));
      }
      if (!getUserResult.verified) {
        return _bluebird2.default.reject(new Error('UserNotVerified'));
      }
      return (0, _awsbbHashing.computeHash)(password, getUserResult.salt).then(function (computeHashResult) {
        console.log(computeHashResult);
        if (getUserResult.hash !== computeHashResult.hash) {
          return _bluebird2.default.reject(new Error('IncorrectPassword'));
        }
        return generateToken(email);
      });
    }).then(function (token) {
      console.log(token);
      context.succeed({
        success: true,
        token: token
      });
    }).catch(function (err) {
      console.log(err);
      context.fail({
        success: false,
        message: err.message
      });
    }).finally(function () {
      cacheClient.stop();
    });
  });
};