'use strict';

require('babel-core/register');
try {
  require('babel-polyfill');
} catch (e) {}

import pkg from '../package.json';

import Joi from 'joi';

import crypto from 'crypto';
import format from 'string-format';
import Promise from 'bluebird';
import AWS from 'aws-sdk';

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
  global.SES = new AWS.SES();
}

const DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

const length = 128;
const iterations = 4096;

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
        return resolve(email);
      }
      reject(new Error('UserNotFound'));
    });
  });
};

const storeToken = (email) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, token) => {
      if (err) {
        return reject(err);
      }
      token = token.toString('hex');
      DynamoDB.updateItem({
        TableName: 'awsBB_Users',
        Key: {
          email: {
            S: email
          }
        },
        AttributeUpdates: {
          lostToken: {
            Action: 'PUT',
            Value: {
              S: token
            }
          }
        }
      }, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    });
  });
};

const sendLostPasswordEmail = (email, token) => {
  return new Promise((resolve, reject) => {
    let subject = format('Password Lost For [{}]', Config.EXTERNAL_NAME);
    let lostPasswordLink = format('{}?email={}&lost={}', Config.RESET_PAGE, encodeURIComponent(email), token);
    let template = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>{0}</title></head><body>Please <a href="{1}">click here to reset your password</a> or copy & paste the following link in a browser:<br><br><a href="{1}">{1}</a></body></html>';
    let HTML = format(template, subject, lostPasswordLink);
    SES.sendEmail({
      Source: Config.EMAIL_SOURCE,
      Destination: {
        ToAddresses: [
          email
        ]
      },
      Message: {
        Subject: {
          Data: subject
        },
        Body: {
          Html: {
            Data: HTML
          }
        }
      }
    }, (err, info) => {
      if (err) {
        return reject(err);
      }
      resolve(info);
    });
  });
};

const joiEventSchema = Joi.object().keys({
  email: Joi.string().email()
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

  return validate(event.payload)
    .then(() => {
      return getUser(email);
    })
    .then((email) => {
      return storeToken(email);
    })
    .then((token) => {
      return sendLostPasswordEmail(email, token);
    })
    .then((info) => {
      console.log(info);
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
