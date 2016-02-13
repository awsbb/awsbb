import Boom from 'boom';
import Joi from 'joi';

import Promise from 'bluebird';
import AWS from 'aws-sdk';

const boomError = ({ message, code = 500 }) => {
  const boomData = Boom.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

const DynamoDB = new AWS.DynamoDB({
  region: process.env.REGION,
  endpoint: new AWS.Endpoint(process.env.DDB_ENDPOINT)
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
        const verified = data.Item.verified.BOOL;
        let token = null;
        if (!verified) {
          token = data.Item.verifyToken.S;
        }
        return resolve({
          verified,
          token
        });
      }
      reject(boomError({
        message: 'User Not Found',
        code: 404
      }));
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
  const email = event.payload.email;
  const verify = event.payload.verify;

  return validate(event.payload)
    .then(() => getUserInfo(email))
    .then(({ verified, token }) => {
      if (verified) {
        return Promise.resolve();
      }
      if (verify !== token) {
        return Promise.reject(boomError({
          message: 'Invalid Verify Token',
          code: 401
        }));
      }
      return Promise.resolve();
    })
    .then(() => updateUser(email))
    .then(() => {
      context.succeed({
        success: true
      });
    })
    .catch((err) => {
      context.fail(err);
    });
}
