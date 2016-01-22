'use strict';

var pkg = require('./package.json');

var crypto = require('crypto');
var format = require('string-format');
var Promise = require('bluebird');
var AWS = require('aws-sdk');

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
  global.SES = new AWS.SES();
}

var DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

var length = 128;
var iterations = 4096;

function computeHash(password, salt) {
  if (salt) {
    return new Promise(function (resolve, reject) {
      crypto.pbkdf2(password, salt, iterations, length, function (err, key) {
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
  var randomBytes = new Promise(function (resolve, reject) {
    crypto.randomBytes(length, function (err, salt) {
      if (err) {
        return reject(err);
      }
      salt = salt.toString('base64');
      resolve(salt);
    });
  });
  return randomBytes
    .then(function (salt) {
      return computeHash(password, salt);
    });
}

function ensureUser(email, password, salt) {
  return new Promise(function (resolve, reject) {
    crypto.randomBytes(length, function (err, token) {
      if (err) {
        return reject(err);
      }
      token = token.toString('hex');
      DynamoDB.putItem({
        TableName: 'AuthUsers',
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
        resolve(token);
      });
    });
  });
}

function sendVerificationEmail(email, token) {
  return new Promise(function (resolve, reject) {
    var subject = format('Verification Email [{}]', Config.EXTERNAL_NAME);
    var verificationLink = format('{}?email={}&verify={}', Config.VERIFICATION_PAGE, encodeURIComponent(email), token);
    var template = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>{0}</title></head><body>Please <a href="{1}">click here to verify your email address</a> or copy & paste the following link in a browser:<br><br><a href="{1}">{1}</a></body></html>';
    var HTML = format(template, subject, verificationLink);
    SES.sendEmail({
      Source: Config.EMAIL_SOURCE,
      Destination: {
        ToAddresses: [
          email
        ]
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
}

exports.handler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  var email = event.payload.email;
  var password = event.payload.password;

  computeHash(password)
    .then(function (computeHashResult) {
      console.log(computeHashResult);
      ensureUser(email, result.hash, result.salt)
        .then(function (token) {
          console.log(token);
          sendVerificationEmail(email, token)
            .then(function (info) {
              console.log(info);
              context.succeed({
                success: true
              });
            })
            .catch(function (err) {
              console.log(err);
              context.fail({
                success: false
              });
            });
        })
        .catch(function (err) {
          console.log(err);
          context.fail({
            success: false
          });
        });
    })
    .catch(function (err) {
      console.log(err);
      context.fail({
        success: false
      });
    });
};
