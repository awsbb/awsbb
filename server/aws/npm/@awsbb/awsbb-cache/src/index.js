import Boom from 'boom';

const boomError = (message, code = 500) => {
  const boomData = Boom.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

import _ from 'underscore';
import moment from 'moment';
import Promise from 'bluebird';

import Catbox from 'catbox';
import CatboxRedis from 'catbox-redis';

import jwt from 'jsonwebtoken';

let cacheClient = null;

const decode = (authorization) => {
  return new Promise((resolve, reject) => {
    const parts = authorization.split(/\s+/);
    if (parts[0] && parts[0].toLowerCase() !== 'bearer') {
      return reject(boomError('Bearer', 401));
    }
    if (parts.length !== 2) {
      return reject(boomError('Bad HTTP Authentication Header Format', 400));
    }
    if (parts[1].split('.').length !== 3) {
      return reject(boomError('Bad HTTP Authentication Header Format', 400));
    }
    const token = parts[1];
    jwt.verify(token, Config.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.message === 'jwt expired') {
          return reject(boomError('Expired token received for JSON Web Token validation', 401));
        }
        return reject(boomError('Invalid signature received for JSON Web Token validation', 401));
      }
      resolve(decoded);
    });
  });
};

export default class Cache {
  constructor(endpoint = '127.0.0.1:6379', password = '') {
    cacheClient = new Catbox.Client(CatboxRedis, {
      partition: 'catbox-awsBB',
      host: endpoint.split(':')[0],
      port: endpoint.split(':')[1],
      password
    });
  }
  start() {
    return new Promise((resolve, reject) => {
      cacheClient.start((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
  stop() {
    return new Promise((resolve) => {
      cacheClient.stop();
      resolve();
    });
  }
  authorizeUser(userEmail, headers) {
    const authorization = headers.authorization;
    const userSessionID = headers['x-awsbb-sessionid'];
    if (!authorization) {
      return Promise.reject(boomError('Bearer', 401));
    }
    return this.get('logins', userSessionID)
      .then(({ value }) => {
        // get the decoded value of what's in the cache
        return decode(`Bearer ${value}`)
          .then(({ email, sessionID }) => {
            return Promise.resolve({
              cacheEmail: email,
              cacheSessionID: sessionID
            });
          })
          .then(({ cacheEmail, cacheSessionID }) => {
            // get the decoded value of what was sent in headers
            return decode(authorization)
              .then(({ email, sessionID }) => {
                // compare all three areas of information
                const userInfo = {
                  email: userEmail,
                  sessionID: userSessionID
                };
                const cacheInfo = {
                  email: cacheEmail,
                  sessionID: cacheSessionID
                };
                const authorizationInfo = {
                  email,
                  sessionID
                };
                const valid = _.isEqual(userInfo, cacheInfo) && _.isEqual(userInfo, authorizationInfo) && _.isEqual(cacheInfo, authorizationInfo);
                if (valid) {
                  return Promise.resolve();
                }
                return Promise.reject(boomError('Unauthorized Session', 401));
              });
          });
      });
  }
  get(segment, id) {
    return new Promise((resolve, reject) => {
      cacheClient.get({
        segment,
        id
      }, (err, cached) => {
        if (err) {
          return reject(err);
        }
        if (cached && cached.item) {
          return resolve(cached.item);
        }
        reject(boomError('Unauthorized', 401));
      });
    });
  }
  drop(segment, id) {
    return new Promise((resolve, reject) => {
      cacheClient.drop({
        segment,
        id
      }, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
  set(segment, id, value) {
    return new Promise((resolve, reject) => {
      cacheClient.set({
        segment,
        id
      }, {
        value,
        accessed: new Date(moment.utc().format())
      }, 60 * 1000, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}
