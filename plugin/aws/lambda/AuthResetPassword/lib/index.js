'use strict';

require('babel-core/register');
try {
  require('babel-polyfill');
} catch (e) {}

var pkg = require('../package.json');

var Joi = require('joi');

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
        if(data.Item.lostToken) {
          let token = data.Item.lostToken.S;
          return resolve(token);
        }
        return reject(new Error('UserHasNoLostToken'));
      }
      reject(new Error('UserNotFound'));
    });
  });
}

function updateUser(email, hash, salt) {
  return new Promise(function (resolve, reject) {
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
}

var joiEventSchema = Joi.object().keys({
  email: Joi.string().email(),
  lost: Joi.string().hex().min(2),
  password: Joi.string().min(6)
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
      var lost = event.payload.lost;
      var password = event.payload.password;
      getUser(email)
        .then(function (token) {
          console.log(token);
          if (lost !== token) {
            return context.fail({
              success: false,
              message: 'InvalidResetPasswordToken'
            });
          }
          computeHash(password)
            .then(function (computeHashResult) {
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
