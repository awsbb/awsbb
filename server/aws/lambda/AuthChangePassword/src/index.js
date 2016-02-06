import pkg from '../package.json';

import Boom from 'boom';
import Joi from 'joi';

import Promise from 'bluebird';
import AWS from 'aws-sdk';

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
}

import { computeHash } from '@awsbb/awsbb-hashing';
import Cache from '@awsbb/awsbb-cache';

const boomError = ({ message, code = 500 }) => {
  const boomData = Boom.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

// the redis cacheClient will connect and partition data in database 0
const cache = new Cache({
  endpoint: Config.AWS.EC_ENDPOINT
});

const DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

const getUserInfo = (email) => {
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
        const salt = data.Item.passwordSalt.S;
        const hash = data.Item.passwordHash.S;
        const verified = data.Item.verified.BOOL;
        return resolve({
          salt,
          hash,
          verified
        });
      }
      reject(boomError({
        message: 'User Not Found',
        code: 404
      }));
    });
  });
};

const updateUser = ({ email, hash, salt }) => {
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
      reject(boomError({
        message: 'Invalid Password/Confirmation Combination',
        code: 400
      }));
    });
  });
};

export function handler(event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  const email = event.payload.email;
  const currentPassword = event.payload.currentPassword;
  const password = event.payload.password;

  const userSessionID = event.headers['x-awsbb-sessionid'];

  return cache.start()
    .then(() => cache.authorizeUser({ userEmail: email, headers: event.headers }))
    .then(() => validate(event.payload))
    .then(() => getUserInfo(email))
    .then(({ salt, hash, verified }) => {
      if (!verified) {
        return Promise.reject(boomError({
          message: 'User Not Verified',
          code: 401
        }));
      }
      const userHash = hash;
      return computeHash({ password: currentPassword, salt })
        .then(({ hash }) => {
          if (userHash !== hash) {
            return Promise.reject(boomError({
              message: 'Invalid Password',
              code: 401
            }));
          }
          return computeHash({ password });
        });
    })
    .then(({ salt, hash }) => updateUser({ email, hash, salt }))
    .then(() => cache.drop({ segment: 'logins', id: userSessionID }))
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
}
