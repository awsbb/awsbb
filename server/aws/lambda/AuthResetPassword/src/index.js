import pkg from '../package.json';

import Boom from 'boom';
import Joi from 'joi';

import Promise from 'bluebird';
import AWS from 'aws-sdk';

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
}

import { computeHash } from '@awsbb/awsbb-hashing';

const boomError = ({ message, code = 500 }) => {
  const boomData = Boom.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

const DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

const getUserToken = (email) => {
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
          const token = data.Item.lostToken.S;
          return resolve(token);
        }
        return reject(boomError({
          message: 'User Missing Lost Token',
          code: 401
        }));
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
  const lost = event.payload.lost;
  const password = event.payload.password;

  return validate(event.payload)
    .then(() => getUserToken(email))
    .then((token) => {
      if (lost !== token) {
        return Promise.reject(boomError({
          message: 'Invalid Lost Token',
          code: 401
        }));
      }
      return Promise.resolve();
    })
    .then(() => computeHash({ password }))
    .then(({ salt, hash }) => updateUser({ email, hash, salt }))
    .then(() => {
      context.succeed({
        success: true
      });
    })
    .catch((err) => {
      context.fail(err);
    });
}
