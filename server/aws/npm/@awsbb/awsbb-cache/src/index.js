'use strict';

import moment from 'moment';
import Promise from 'bluebird';

import Catbox from 'catbox';
import CatboxRedis from 'catbox-redis';

import jwt from 'jsonwebtoken';

let cacheClient = null;

const decode = (authorization) => {
  return new Promise((resolve, reject) => {
    let parts = authorization.split(/\s+/);
    if (parts[0] && parts[0].toLowerCase() !== 'bearer') {
      return reject(new Error('NotBearerToken'));
    }
    if (parts.length !== 2) {
      return reject(new Error('BadHTTPAuthenticationHeaderFormat'));
    }
    if(parts[1].split('.').length !== 3) {
      return reject(new Error('BadHTTPAuthenticationHeaderFormat'));
    }
    let token = parts[1];
    jwt.verify(token, Config.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.message === 'jwt expired') {
          return reject(new Error('ExpiredToken'));
        }
        return reject(new Error('InvalidTokenSignature'));
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
      password: password
    });
  }
  start() {
    return new Promise((resolve, reject) => {
      cacheClient.start(err => {
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
  authorizeUser(email, headers) {
    let authorization = headers.authorization;
    let sessionID = headers['x-awsbb-sessionid'];
    if(!authorization) {
      return Promise.reject(new Error('AuthorizationHeaderMissing'));
    }
    return this.get('logins', sessionID)
      .then((cacheResult) => {
        // get the decoded value of what's in the cache
        return decode(`Bearer ${cacheResult.value}`)
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
                // compare the two
                if (cacheEmail === email && cacheSessionID === sessionID) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('UserNotAuthorized'));
              });
          });
      });
  }
  get(segment, id) {
    return new Promise((resolve, reject) => {
      cacheClient.get({
        segment: segment,
        id: id
      }, (err, cached) => {
        if (err) {
          return reject(err);
        }
        if (cached && cached.item) {
          return resolve(cached.item);
        }
        reject(new Error('CacheItemNotFound'));
      });
    });
  }
  drop(segment, id) {
    return new Promise((resolve, reject) => {
      cacheClient.drop({
        segment: segment,
        id: id
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
        segment: segment,
        id: id
      }, {
        value: value,
        accessed: new Date(moment.utc().format())
      }, 60 * 1000, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
};
