'use strict';

try {
  require('babel-register');
} catch (e) {}
try {
  require('babel-polyfill');
} catch (e) {}

import pkg from '../package.json';

import Joi from 'joi';

import Promise from 'bluebird';
import AWS from 'aws-sdk';

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
}

import { computeHash } from '@awsbb/awsbb-hashing';

const DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

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
        if (data.Item.lostToken) {
          let token = data.Item.lostToken.S;
          return resolve(token);
        }
        return reject(new Error('UserHasNoLostToken'));
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
        },
        lostToken: {
          Action: 'DELETE'
        }
      }
    }, (err, data) => {
      if (err) {
        return reject(err, data);
      }
      resolve(data);
    });
  });
};

const joiEventSchema = Joi.object().keys({
  email: Joi.string().email(),
  lost: Joi.string().hex().min(2),
  password: Joi.string().min(6),
  confirmation: Joi.string().min(6)
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
      if (event.password === event.confirmation) {
        return resolve();
      }
      reject(new Error('PasswordConfirmationNotEqual'));
    });
  });
};

export function handler (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  let email = event.payload.email;
  let lost = event.payload.lost;
  let password = event.payload.password;

  return validate(event.payload)
    .then(() => {
      return getUser(email);
    })
    .then((token) => {
      console.log(token);
      if (lost !== token) {
        return Promise.reject(new Error('InvalidResetPasswordToken'));
      }
      return computeHash(password);
    })
    .then((computeHashResult) => {
      return updateUser(email, computeHashResult.hash, computeHashResult.salt);
    })
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
};
