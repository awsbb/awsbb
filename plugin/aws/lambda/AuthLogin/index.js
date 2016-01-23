'use strict';

var pkg = require('./package.json');

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
}

var joiEventSchema = Joi.object().keys({
  email: Joi.string().email(),
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
      var password = event.payload.password;
      getUser(email)
        .then(function(getUserResult){
          console.log(getUserResult);
          if(!getUserResult.hash) {
            return context.fail({
              success: false,
              message: 'UserHasNoHash'
            });
          }
          if(!getUserResult.verified){
            return context.fail({
              success: false,
              message: 'UserNotVerified'
            });
          }
          computeHash(password, getUserResult.salt)
            .then(function(computeHashResult){
              console.log(computeHashResult);
              if(getUserResult.hash !== computeHashResult.hash) {
                return context.fail({
                  success: false,
                  message: 'IncorrectPassword'
                });
              }
              // TODO: Create AuthBearer Token and store in caching system
              context.succeed({
                success: true
              });
            })
            .catch(function(err) {
              console.log(err);
              context.fail({
                success: false,
                message: err.message
              });
            });
        })
        .catch(function(err){
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
