'use strict';

import pkg from '../package.json';

import Joi from 'joi';

import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import AWS from 'aws-sdk';
import uuid from 'node-uuid';

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
        let hash = data.Item.passwordHash.S;
        let salt = data.Item.passwordSalt.S;
        let verified = data.Item.verified.BOOL;
        return resolve({
          salt,
          hash,
          verified
        });
      }
      reject(new Error('UserNotFound'));
    });
  });
};

const generateToken = (email, roles = []) => {
  return new Promise((resolve, reject) => {
    let application = 'awsBB';
    let sessionID = uuid.v4();
    let token = jwt.sign({
      email,
      application,
      roles,
      sessionID
    }, Config.JWT_SECRET);
    return cache.set('logins', sessionID, token)
      .then(() => {
        resolve({
          sessionID,
          token
        });
      })
      .catch((err) => reject(err));
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

export function handler(event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  let email = event.payload.email;
  let password = event.payload.password;

  return cache.start()
    .then(() => {
      return validate(event.payload)
        .then(() => getUser(email))
        .then(({ salt, hash, verified }) => {
          if (!hash) {
            return Promise.reject(new Error('UserHasNoHash'));
          }
          if (!verified) {
            return Promise.reject(new Error('UserNotVerified'));
          }
          let userHash = hash;
          return computeHash(password, salt)
            .then(({ hash }) => {
              if (userHash !== hash) {
                return Promise.reject(new Error('IncorrectPassword'));
              }
              return generateToken(email);
            });
        });
    })
    .then(({ sessionID, token }) => {
      context.succeed({
        success: true,
        sessionID,
        token
      });
    })
    .catch((err) => {
      console.log(err);
      context.fail({
        success: false,
        message: err.message
      });
    })
    .finally(() => {
      return cache.stop();
    });
};
