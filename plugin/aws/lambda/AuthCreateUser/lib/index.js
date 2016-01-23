'use strict';

require('babel-core/register');
try {
  require('babel-polyfill');
} catch (e) {}

const pkg = require('./package.json');

const Joi = require('joi');

const crypto = require('crypto');
const format = require('string-format');
const Promise = require('bluebird');
const AWS = require('aws-sdk');

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
  global.SES = new AWS.SES();
}

let DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

let length = 128;
let iterations = 4096;

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
    let verificationLink = format('{}?email={}&verify={}', Config.VERIFICATION_PAGE, encodeURIComponent(email), token);
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

exports.handler = (event, context) => {
  console.log('Event:', event);
  console.log('Context:', context);

  return validate(event.payload)
    .then(() => {
      let password = event.payload.password;
      return computeHash(password);
    })
    .then((hash) => {
      console.log(hash);

      return ensureUser(event.payload.email);
    })
    .then((token) => {
      return sendVerificationEmail(event.payload.email, token);
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
