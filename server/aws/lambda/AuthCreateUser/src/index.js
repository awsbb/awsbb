'use strict';

try {
  require('babel-register');
} catch (e) {}
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

import { computeHash } from '@awsbb/awsbb-hashing';

const DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

const length = 128;

const ensureUser = (email, password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, token) => {
      if (err) {
        return reject(err);
      }
      token = token.toString('hex');
      DynamoDB.putItem({
        TableName: 'awsBB_Users',
        Item: {
          email: {
            S: email
          },
          passwordHash: {
            S: password
          },
          passwordSalt: {
            S: salt
          },
          verified: {
            BOOL: false
          },
          verifyToken: {
            S: token
          }
        },
        ConditionExpression: 'attribute_not_exists (email)'
      }, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    });
  });
};

const sendVerificationEmail = (email, token) => {
  return new Promise((resolve, reject) => {
    let subject = format('Verification Email [{}]', Config.EXTERNAL_NAME);
    let verificationLink = format('{}?email={}&verify={}&type=user', Config.VERIFICATION_PAGE, encodeURIComponent(email), token);
    let template = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>{0}</title></head><body>Please <a href="{1}">click here to verify your email address</a> or copy & paste the following link in a browser:<br><br><a href="{1}">{1}</a></body></html>';
    let HTML = format(template, subject, verificationLink);

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
  email: Joi.string().email(),
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
  let password = event.payload.password;

  return validate(event.payload)
    .then(() => {
      return computeHash(password);
    })
    .then((computeHashResult) => {
      console.log(computeHashResult);
      return ensureUser(email, computeHashResult.hash, computeHashResult.salt);
    })
    .then((token) => {
      console.log(token);
      return sendVerificationEmail(email, token);
    })
    .then((info) => {
      console.log(info);
      context.succeed({
        success: true
      });
    })
    .catch((err) => {
      context.fail({
        success: false,
        message: err.message
      });
    });
};
