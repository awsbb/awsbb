'use strict';

try {
  require('babel-register');
} catch (e) {}
try {
  require('babel-polyfill');
} catch (e) {}

import pkg from '../package.json';

import Joi from 'joi';

import jwt from 'jsonwebtoken';
import moment from 'moment';
import Promise from 'bluebird';
import AWS from 'aws-sdk';

import Catbox from 'catbox';
import CatboxRedis from 'catbox-redis';

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
          hash: hash,
          salt: salt,
          verified: verified
        });
      }
      reject(new Error('UserNotFound'));
    });
  });
};

const generateToken = (email) => {
  return new Promise((resolve, reject) => {
    var token = jwt.sign({
      email: email,
      application: 'awsBB'
    }, Config.JWT_SECRET);
    cache.set(email, token)
      .then(() => {
        resolve(token);
      })
      .catch((err) => {
        reject(err);
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

export function handler (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  let email = event.payload.email;
  let password = event.payload.password;
  // let userToken = event.headers['X-awsBB-User-Token'];

  return cache.start()
    .then(() => {
      return validate(event.payload)
        .then(() => {
          return getUser(email);
        })
        .then((getUserResult) => {
          console.log(getUserResult);
          if (!getUserResult.hash) {
            return Promise.reject(new Error('UserHasNoHash'));
          }
          if (!getUserResult.verified) {
            return Promise.reject(new Error('UserNotVerified'));
          }
          return computeHash(password, getUserResult.salt)
            .then((computeHashResult) => {
              console.log(computeHashResult);
              if (getUserResult.hash !== computeHashResult.hash) {
                return Promise.reject(new Error('IncorrectPassword'));
              }
              return generateToken(email);
            });
        })
        .then((token) => {
          console.log(token);
          context.succeed({
            success: true,
            token: token
          });
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
