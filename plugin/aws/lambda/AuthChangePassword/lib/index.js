'use strict';

require('babel-core/register');
try {
  require('babel-polyfill');
} catch (e) {}

import pkg from '../package.json';

import Joi from 'joi';

import crypto from 'crypto';
import Promise from 'bluebird';
import AWS from 'aws-sdk';

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
}

const DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

const length = 128;
const iterations = 4096;

const computeHash = (password, salt) => {
  if (salt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, iterations, length, (err, key) => {
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
  let randomBytes = new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, salt) => {
      if (err) {
        return reject(err);
      }
      salt = salt.toString('base64');
      resolve(salt);
    });
  });
  return randomBytes
    .then((salt) => {
      return computeHash(password, salt);
    });
};

const getUser = (email) => {
  return new Promise((resolve, reject) => {
    DynamoDB.getItem({
      TableName: 'awsBB_Users',
      Key: {
        email: {
          S: email
        }
      }
    }, (err, data) => {
      if (err) {
        return reject(err);
      }
      if (data.Item) {
        let hash = data.Item.passwordHash.S;
        let salt = data.Item.passwordSalt.S;
        let verified = data.Item.verified.BOOL;
        return resolve({
          hash: hash,
          salt: salt,
          verified: verified
        });
      }
      reject(new Error('UserNotFound'));
    });
  });
};

const updateUser = (email, hash, salt) => {
  return new Promise((resolve, reject) => {
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
        }
      }
    }, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

const joiEventSchema = Joi.object().keys({
  email: Joi.string().email(),
  currentPassword: Joi.string().min(6),
  password: Joi.string().min(6)
});

const joiOptions = {
  abortEarly: false
};

const validate = (event) => {
  return new Promise((resolve, reject) => {
    Joi.validate(event, joiEventSchema, joiOptions, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

exports.handler = (event, context) => {
  console.log('Event:', event);
  console.log('Context:', context);

  validate(event.payload)
    .then(() => {
      let email = event.payload.email;
      let currentPassword = event.payload.currentPassword;
      let password = event.payload.password;
      getUser(email)
        .then((getUserResult) => {
          console.log(getUserResult);
          if (!getUserResult.hash) {
            return context.fail({
              success: false,
              message: 'UserHasNoHash'
            });
          }
          if (!getUserResult.verified) {
            return context.fail({
              success: false,
              message: 'UserNotVerified'
            });
          }
          computeHash(currentPassword, getUserResult.salt)
            .then((computeCurrentHashResult) => {
              console.log(computeCurrentHashResult);
              if (getUserResult.hash !== computeCurrentHashResult.hash) {
                return context.fail({
                  success: false,
                  message: 'IncorrectPassword'
                });
              }
              computeHash(password)
                .then((computeHashResult) => {
                  console.log(computeHashResult);
                  updateUser(email, computeHashResult.hash, computeHashResult.salt)
                    .then((updateUserResult) => {
                      console.log(updateUserResult);
                      context.succeed({
                        success: true
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      context.fail({
                        success: false,
                        message: err.message
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  context.fail({
                    success: false,
                    message: err.message
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              context.fail({
                success: false,
                message: err.message
              });
            });
        })
        .catch((err) => {
          console.log(err);
          context.fail({
            success: false,
            message: err.message
          });
        });
    })
    .catch((err) => {
      console.log(err);
      context.fail({
        success: false,
        message: err.message
      });
    });
};
