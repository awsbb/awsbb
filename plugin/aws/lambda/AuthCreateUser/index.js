'use strict';

var pkg = require('./package.json');

var crypto = require('crypto');

var Promise = require('bluebird');
global.Config = pkg.config;

var AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

var length = 128;
var iterations = 4096;

function computeHash(password, salt) {
  return new Promise(function (resolve, reject) {
    crypto.pbkdf2(password, salt, iterations, length, function (err, key) {
      if (err) {
        return reject(err);
      }
      return resolve([salt, key.toString('base64')]);
    });
  });
}

function generateHash(password, salt) {
  return new Promise(function (resolve, reject) {
    if (salt) {
      computeHash(password, salt)
        .then(resolve)
        .catch(reject);
    }
    crypto.randomBytes(length, function (err, salt) {
      if (err) {
        return reject(err);
      }
      computeHash(password, salt.toString('base64'))
        .then(resolve)
        .catch(reject);
    });
  });
}

function ensureUser(email, password, salt) {
  return new Promise(function (resolve, reject) {
    crypto.randomBytes(length, function (err, token) {
      if (err) {
        return reject(err);
      }
      token = token.toString('hex');
      dynamodb.putItem({
        TableName: Config.AWS.DDB_USERS_TABLE,
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
    // TODO: Using nodemailer/mailgun or SES actually send the email
    resolve();
  });
}

exports.handler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  var email = event.payload.email;
  var clearTextPassword = event.payload.password;

  generateHash(clearTextPassword)
    .spread(function (salt, hash) {
      ensureUser(email, hash, salt)
        .then(function (token) {
          console.log(token);
          sendVerificationEmail(email, token)
            .then(function (data) {
              console.log(data);
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
