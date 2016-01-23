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

const joiEventSchema = Joi.object().keys({
  email: Joi.string().email(),
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

  let email = event.payload.email;
  let password = event.payload.password;

  validate(event.payload)
    .then(() => {
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
    .catch((err) => {
      console.log(err);
      context.fail({
        success: false,
        message: err.message
      });
    });
};
