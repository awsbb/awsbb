import pkg from '../package.json';

import Boom from 'boom';
import Joi from 'joi';

import crypto from 'crypto';
import format from 'string-format';
import Promise from 'bluebird';
import AWS from 'aws-sdk';

if (process.env.NODE_ENV === 'production') {
  global.Config = pkg.config;
  global.SES = new AWS.SES();
}

const boomError = (message, code = 500) => {
  const boomData = Boom.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

const DynamoDB = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

const length = 128;

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
      reject(boomError('User Not Found', 404));
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
    const subject = format('Password Lost For [{}]', Config.EXTERNAL_NAME);
    const lostPasswordLink = format('{}?email={}&lost={}', Config.RESET_PAGE, encodeURIComponent(email), token);
    const template = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>{0}</title></head><body>Please <a href="{1}">click here to reset your password</a> or copy & paste the following link in a browser:<br><br><a href="{1}">{1}</a></body></html>';
    const HTML = format(template, subject, lostPasswordLink);
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

export function handler(event, context) {
  console.log('Event:', event);
  console.log('Context:', context);

  const email = event.payload.email;

  return validate(event.payload)
    .then(() => getUser(email))
    .then((email) => storeToken(email))
    .then((token) => sendLostPasswordEmail(email, token))
    .then(() => {
      context.succeed({
        success: true
      });
    })
    .catch((err) => {
      context.fail(err);
    });
}
