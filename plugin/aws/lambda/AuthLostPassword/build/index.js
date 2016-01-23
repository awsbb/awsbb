'use strict';

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _stringFormat = require('string-format');

var _stringFormat2 = _interopRequireDefault(_stringFormat);

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
  global.SES = new _awsSdk2.default.SES();
}

var DynamoDB = new _awsSdk2.default.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new _awsSdk2.default.Endpoint(Config.AWS.DDB_ENDPOINT)
});

var length = 128;
var iterations = 4096;

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
        return resolve(email);
      }
      reject(new Error('UserNotFound'));
    });
  });
};

var storeToken = function storeToken(email) {
  return new _bluebird2.default(function (resolve, reject) {
    _crypto2.default.randomBytes(length, function (err, token) {
      if (err) {
        return reject(err);
      }
      token = token.toString('hex');
      DynamoDB.updateItem({
        TableName: 'awsBB_Users',
        Key: {
          email: {
            S: email
          }
        },
        AttributeUpdates: {
          lostToken: {
            Action: 'PUT',
            Value: {
              S: token
            }
          }
        }
      }, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    });
  });
};

var sendLostPasswordEmail = function sendLostPasswordEmail(email, token) {
  return new _bluebird2.default(function (resolve, reject) {
    var subject = (0, _stringFormat2.default)('Password Lost For [{}]', Config.EXTERNAL_NAME);
    var lostPasswordLink = (0, _stringFormat2.default)('{}?email={}&lost={}', Config.RESET_PAGE, encodeURIComponent(email), token);
    var template = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>{0}</title></head><body>Please <a href="{1}">click here to reset your password</a> or copy & paste the following link in a browser:<br><br><a href="{1}">{1}</a></body></html>';
    var HTML = (0, _stringFormat2.default)(template, subject, lostPasswordLink);
    SES.sendEmail({
      Source: Config.EMAIL_SOURCE,
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Subject: {
          Data: subject
        },
        Body: {
          Html: {
            Data: HTML
          }
        }
      }
    }, function (err, info) {
      if (err) {
        return reject(err);
      }
      resolve(info);
    });
  });
};

var joiEventSchema = _joi2.default.object().keys({
  email: _joi2.default.string().email()
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

  return validate(event.payload).then(function () {
    return getUser(email);
  }).then(function (email) {
    console.log(email);
    return storeToken(email);
  }).then(function (token) {
    console.log(token);
    return sendLostPasswordEmail(email, token);
  }).then(function (info) {
    console.log(info);
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