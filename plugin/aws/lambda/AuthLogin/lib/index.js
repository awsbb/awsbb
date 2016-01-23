'use strict';

require('babel-core/register');
try {
  require('babel-polyfill');
} catch (e) {}

import pkg from '../package.json';

import Joi from 'joi';

import jwt from 'jsonwebtoken';
import moment from 'moment';
import crypto from 'crypto';
import Promise from 'bluebird';
import AWS from 'aws-sdk';

import Catbox from 'catbox';
import CatboxRedis from 'catbox-redis';

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
}

// the redis cacheClient will connect and partition data in database 0
const cacheClient = new Catbox.Client(CatboxRedis, {
  partition: 'catbox-awsBB',
  host: Config.AWS.EC_ENDPOINT.split(':')[0],
  port: Config.AWS.EC_ENDPOINT.split(':')[1],
  password: ''
});

const cache = {
  get: (id) => {
    return new Promise((resolve, reject) => {
      cacheClient.get({
        segment: 'logins',
        id: id
      }, (err, cached) => {
        if (err) {
          return reject(err);
        }
        if (cached && cached.item) {
          return resolve(cached.item);
        }
        resolve();
      });
    });
  },
  set: (id, value) => {
    return new Promise((resolve, reject) => {
      cacheClient.set({
        segment: 'logins',
        id: id
      }, {
        value: value,
        accessed: new Date(moment.utc().format())
      }, 60 * 1000, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
};

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

exports.handler = (event, context) => {
  console.log('Event:', event);
  console.log('Context:', context);

  let email = event.payload.email;
  let password = event.payload.password;
  // let userToken = event.headers['X-awsBB-User-Token'];

  cacheClient.start((err) => {
    if (err) {
      return context.fail({
        success: false,
        message: err.message
      });
    }
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
      })
      .catch((err) => {
        console.log(err);
        context.fail({
          success: false,
          message: err.message
        });
      })
      .finally(() => {
        cacheClient.stop();
      });
  });
};
