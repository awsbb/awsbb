import pkg from '../package.json';

import Boom from 'boom';
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

const boomError = (message, code = 500) => {
  const boomData = Boom.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

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
        const hash = data.Item.passwordHash.S;
        const salt = data.Item.passwordSalt.S;
        const verified = data.Item.verified.BOOL;
        return resolve({
          salt,
          hash,
          verified
        });
      }
      reject(boomError('User Not Found', 404));
    });
  });
};

const generateToken = (email, roles = []) => {
  return new Promise((resolve, reject) => {
    const application = 'awsBB';
    const sessionID = uuid.v4();
    const token = jwt.sign({
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

  const email = event.payload.email;
  const password = event.payload.password;

  return cache.start()
    .then(() => validate(event.payload))
    .then(() => getUser(email))
    .then(({ salt, hash, verified }) => {
      if (!verified) {
        return Promise.reject(boomError('User Not Verified', 401));
      }
      const userHash = hash;
      return computeHash(password, salt)
        .then(({ hash }) => {
          if (userHash !== hash) {
            return Promise.reject(boomError('Invalid Password', 401));
          }
          return generateToken(email);
        });
    })
    .then(({ sessionID, token }) => {
      context.succeed({
        success: true,
        data: {
          sessionID,
          token
        }
      });
    })
    .catch((err) => {
      console.log(err);
      context.fail(err);
    })
    .finally(() => {
      return cache.stop();
    });
}
