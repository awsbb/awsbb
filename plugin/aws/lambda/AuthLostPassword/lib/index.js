'use strict';

require('babel-core/register');
try {
  require('babel-polyfill');
} catch (e) {}

var pkg = require('../package.json');

var Joi = require('joi');

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

function getUser(email) {
  return new Promise(function (resolve, reject) {
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
}

function storeToken(email) {
  return new Promise(function (resolve, reject) {
    crypto.randomBytes(length, function (err, token) {
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
}

function sendLostPasswordEmail(email, token) {
  return new Promise(function (resolve, reject) {
    var subject = format('Password Lost For [{}]', Config.EXTERNAL_NAME);
    var lostPasswordLink = format('{}?email={}&lost={}', Config.RESET_PAGE, encodeURIComponent(email), token);
    var template = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>{0}</title></head><body>Please <a href="{1}">click here to reset your password</a> or copy & paste the following link in a browser:<br><br><a href="{1}">{1}</a></body></html>';
    var HTML = format(template, subject, lostPasswordLink);
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

var joiEventSchema = Joi.object().keys({
  email: Joi.string().email()
});

var joiOptions = {
  abortEarly: false
};

function validate(event) {
  return new Promise(function (resolve, reject) {
    Joi.validate(event, joiEventSchema, joiOptions, function (err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

exports.handler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  validate(event.payload)
    .then(function () {
      var email = event.payload.email;
      getUser(email)
        .then(function (email) {
          storeToken(email)
            .then(function (token) {
              sendLostPasswordEmail(email, token)
                .then(function (info) {
                  console.log(info);
                  context.succeed({
                    success: true
                  });
                })
                .catch(function (err) {
                  console.log(err);
                  context.fail({
                    success: false,
                    message: err.message
                  });
                });
            })
            .catch(function (err) {
              console.log(err);
              context.fail({
                success: false,
                message: err.message
              });
            });
        })
        .catch(function (err) {
          console.log(err);
          context.fail({
            success: false,
            message: err.message
          });
        });
    })
    .catch(function (err) {
      console.log(err);
      context.fail({
        success: false,
        message: err.message
      });
    });
};
