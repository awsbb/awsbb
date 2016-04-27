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

var _awsbbHashing = require('@awsbb/awsbb-hashing');

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

var createUserWithToken = function createUserWithToken(_ref2) {
  var email = _ref2.email;
  var password = _ref2.password;
  var salt = _ref2.salt;

  return new _bluebird2.default(function (resolve) {
    var token = _crypto2.default.randomBytes(length).toString('hex');
    resolve({
      email: email,
      password: password,
      salt: salt,
      token: token
    });
  });
};

var ensureUser = function ensureUser(_ref3) {
  var email = _ref3.email;
  var password = _ref3.password;
  var salt = _ref3.salt;
  var token = _ref3.token;

  return new _bluebird2.default(function (resolve, reject) {
    DynamoDB.putItem({
      TableName: 'awsBB_Users',
      Item: {
        email: {
          S: email
        },
        passwordHash: {
          S: password
        },
        passwordSalt: {
          S: salt
        },
        verified: {
          BOOL: false
        },
        verifyToken: {
          S: token
        }
      },
      ConditionExpression: 'attribute_not_exists (email)'
    }, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({
        email: email,
        password: password,
        salt: salt,
        token: token
      });
    });
  });
};

var sendVerificationEmail = function sendVerificationEmail(_ref4) {
  var email = _ref4.email;
  var token = _ref4.token;

  return new _bluebird2.default(function (resolve, reject) {
    var subject = (0, _stringFormat2.default)('Verification Email [{}]', process.env.EXTERNAL_NAME);
    var verificationLink = (0, _stringFormat2.default)('{}?email={}&verify={}&type=user', process.env.VERIFICATION_PAGE, encodeURIComponent(email), token);
    var template = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>{0}</title></head><body>Please <a href="{1}">click here to verify your email address</a> or copy & paste the following link in a browser:<br><br><a href="{1}">{1}</a></body></html>';
    var HTML = (0, _stringFormat2.default)(template, subject, verificationLink);

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
  email: _joi2.default.string().email(),
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
  var password = event.payload.password;

  return validate(event.payload).then(function () {
    return (0, _awsbbHashing.computeHash)({ password: password });
  }).then(function (_ref5) {
    var salt = _ref5.salt;
    var hash = _ref5.hash;
    return createUserWithToken({ email: email, password: hash, salt: salt });
  }).then(function (user) {
    return ensureUser(user);
  }).then(function (_ref6) {
    var token = _ref6.token;
    return sendVerificationEmail({ email: email, token: token });
  }).then(function () {
    context.succeed({
      success: true
    });
  }).catch(function (err) {
    context.fail(err);
  });
}