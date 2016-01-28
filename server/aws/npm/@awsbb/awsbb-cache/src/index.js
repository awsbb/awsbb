'use strict';

import moment from 'moment';
import Promise from 'bluebird';

import Catbox from 'catbox';
import CatboxRedis from 'catbox-redis';

let cacheClient = null;

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
        return resolve();
      });
    });
  }
  stop() {
    return new Promise((resolve) => {
      cacheClient.stop();
      resolve();
    });
  }
  authorizeUser(headers) {
    return new Promise((resolve, reject) => {
      // TODO: don't split the string, use the proper one later when using jsonwebtoken parsing
      let token = headers.authorization.split(' ')[1];
      let sessionID = headers['x-awsbb-sessionid'];
      return this.get('logins', sessionID)
        .then((cacheResult) => {
          // TODO: JWT decode/authorize per https://github.com/boketto/hapi-auth-jsonwebtoken
          // if true, resolve, if not reject;
          if (cacheResult.value === token) {
            return resolve();
          }
          reject(new Error('UserNotAuthorized'));
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
