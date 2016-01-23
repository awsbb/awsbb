'use strict';

require('babel-core/register');
try {
  require('babel-polyfill');
} catch (e) {}

var pkg = require('../package.json');

var Joi = require('joi');

var Promise = require('bluebird');
var AWS = require('aws-sdk');

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
}

var DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

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
        var verified = data.Item.verified.BOOL;
        var token = null;
        if (!verified) {
          token = data.Item.verifyToken.S;
        }
        return resolve({
          verified: verified,
          token: token
        });
      }
      reject(new Error('UserNotFound'));
    });
  });
}

function updateUser(email) {
  return new Promise(function (resolve, reject) {
    DynamoDB.updateItem({
      TableName: 'awsBB_Users',
      Key: {
        email: {
          S: email
        }
      },
      AttributeUpdates: {
        verified: {
          Action: 'PUT',
          Value: {
            BOOL: true
          }
        },
        verifyToken: {
          Action: 'DELETE'
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

var joiEventSchema = Joi.object().keys({
  email: Joi.string().email(),
  verify: Joi.string().hex().min(2)
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
      var verify = event.payload.verify;
      getUser(email)
        .then(function (result) {
          console.log(result);
          if (result.verified) {
            return context.succeed({
              success: true
            });
          }
          if (verify !== result.token) {
            return context.fail({
              success: false,
              message: 'InvalidVerifyUserToken'
            });
          }
          updateUser(email)
            .then(function (result) {
              console.log(result);
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
};