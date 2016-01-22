'use strict';

var pkg = require('./package.json');

var crypto = require('crypto');
var Promise = require('bluebird');
var AWS = require('aws-sdk');

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
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

function getUser(email) {
  return new Promise(function (resolve, reject) {
    DynamoDB.getItem({
      TableName: 'AuthUsers',
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
      return reject(new Error('UserNotFound'));
    });
  });
}

function updateUser(email, hash, salt) {
  return new Promise(function (resolve, reject) {
    DynamoDB.updateItem({
      TableName: 'AuthUsers',
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
        }
      }
    }, function (err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

exports.handler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  var email = event.payload.email;
  var currentPassword = event.payload.currentPassword;
  var password = event.payload.password;

  getUser(email)
    .then(function (getUserResult) {
      console.log(getUserResult);
      if (!getUserResult.hash) {
        return context.fail({
          success: false
        });
      }
      if (!getUserResult.verified) {
        return context.fail({
          success: false
        });
      }
      computeHash(currentPassword, getUserResult.salt)
        .then(function (computeCurrentHashResult) {
          console.log(computeCurrentHashResult);
          if (getUserResult.hash !== computeCurrentHashResult.hash) {
            return context.fail({
              success: false
            });
          }
          computeHash(password)
            .then(function (computeHashResult) {
              console.log(computeHashResult);
              updateUser(email, computeHashResult.hash, computeHashResult.salt)
                .then(function (updateUserResult) {
                  console.log(updateUserResult);
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
    })
    .catch(function (err) {
      console.log(err);
      context.fail({
        success: false
      });
    });
};
