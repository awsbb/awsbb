'use strict';

import pkg from '../package.json';

import Joi from 'joi';

import Promise from 'bluebird';
import AWS from 'aws-sdk';

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
}

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
        let verified = data.Item.verified.BOOL;
        let token = null;
        if (!verified) {
          token = data.Item.verifyToken.S;
        }
        return resolve({
          verified,
          token
        });
      }
      reject(new Error('UserNotFound'));
    });
  });
};

const updateUser = (email) => {
  return new Promise((resolve, reject) => {
    DynamoDB.updateItem({
      TableName: 'awsBB_Users',
      Key: {
        email: {
          S: email
        }
      },
      AttributeUpdates: {
        verified: {
          Action: 'PUT',
          Value: {
            BOOL: true
          }
        },
        verifyToken: {
          Action: 'DELETE'
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
  verify: Joi.string().hex().min(2)
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
  let verify = event.payload.verify;

  return validate(event.payload)
    .then(() => getUser(email))
    .then(({ verified, token }) => {
      if (verified) {
        return Promise.resolve({ verified, token });
      }
      if (verify !== token) {
        return Promise.reject(new Error('InvalidVerifyUserToken'));
      }
      return updateUser(email);
    })
    .then((result) => {
      console.log(result);
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
