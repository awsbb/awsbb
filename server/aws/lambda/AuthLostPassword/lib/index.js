'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = handler;

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

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

if (process.env.NODE_ENV === 'production') {
  global.SES = new _awsSdk2.default.SES();
}

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

var length = 128;

var userExists = function userExists(email) {
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
        return resolve();
      }
      reject(boomError({
        message: 'User Not Found',
        code: 404
      }));
    });
  });
};

var createToken = function createToken() {
  return new _bluebird2.default(function (resolve) {
    var token = _crypto2.default.randomBytes(length).toString('hex');
    resolve(token);
  });
};

var storeToken = function storeToken(_ref2) {
  var email = _ref2.email;
  var token = _ref2.token;

  return new _bluebird2.default(function (resolve, reject) {
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
};

var sendLostPasswordEmail = function sendLostPasswordEmail(_ref3) {
  var email = _ref3.email;
  var token = _ref3.token;

  return new _bluebird2.default(function (resolve, reject) {
    var subject = (0, _stringFormat2.default)('Password Lost For [{}]', process.env.EXTERNAL_NAME);
    var lostPasswordLink = (0, _stringFormat2.default)('{}?email={}&lost={}', process.env.RESET_PAGE, encodeURIComponent(email), token);
    var template = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>{0}</title></head><body>Please <a href="{1}">click here to reset your password</a> or copy & paste the following link in a browser:<br><br><a href="{1}">{1}</a></body></html>';
    var HTML = (0, _stringFormat2.default)(template, subject, lostPasswordLink);
    SES.sendEmail({
      Source: process.env.EMAIL_SOURCE,
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

function handler(event, context) {
  var email = event.payload.email;

  return validate(event.payload).then(function () {
    return userExists(email);
  }).then(function () {
    return createToken();
  }).then(function (token) {
    return storeToken({ email: email, token: token });
  }).then(function (token) {
    return sendLostPasswordEmail({ email: email, token: token });
  }).then(function () {
    context.succeed({
      success: true
    });
  }).catch(function (err) {
    context.fail(err);
  });
}