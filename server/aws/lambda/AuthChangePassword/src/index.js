'use strict';

import pkg from '../package.json';

import Joi from 'joi';

import Promise from 'bluebird';
import AWS from 'aws-sdk';

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
}

import { computeHash } from '@awsbb/awsbb-hashing';
import Cache from '@awsbb/awsbb-cache';
// the redis cacheClient will connect and partition data in database 0
const cache = new Cache(Config.AWS.EC_ENDPOINT);

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
        let salt = data.Item.passwordSalt.S;
        let hash = data.Item.passwordHash.S;
        let verified = data.Item.verified.BOOL;
        return resolve({
          salt,
          hash,
          verified
        });
      }
      throw new Error('UserNotFound');
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
      throw new Error('PasswordConfirmationNotEqual');
    });
  });
};

export function handler(event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  let email = event.payload.email;
  let currentPassword = event.payload.currentPassword;
  let password = event.payload.password;

  return cache.start()
    .then(() => {
      return cache.authorizeUser(event.headers)
        .then(() => {
          return validate(event.payload)
            .then(() => getUser(email))
            .then(({ salt, hash, verified }) => {
              if (!hash) {
                throw new Error('UserHasNoHash');
              }
              if (!verified) {
                throw new Error('UserNotVerified');
              }
              let userHash = hash;
              return computeHash(currentPassword, salt)
                .then(({ hash }) => {
                  if (userHash !== hash) {
                    throw new Error('IncorrectPassword');
                  }
                  return computeHash(password);
                });
            })
            .then(({ salt, hash }) => updateUser(email, hash, salt));
        });
    })
    .then(() => {
      context.succeed({
        success: true
      });
    })
    .catch((err) => {
      context.fail(err);
    })
    .finally(() => {
      return cache.stop();
    });
};
