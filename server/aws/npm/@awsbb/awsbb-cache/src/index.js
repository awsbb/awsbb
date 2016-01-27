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
  get(id) {
    return new Promise((resolve, reject) => {
      cacheClient.get({
        segment: 'logins',
        id: id
      }, (err, cached) => {
        if (err) {
          return reject(err);
        }
        if (cached && cached.item) {
          return resolve(cached.item);
        }
        resolve();
      });
    });
  }
  set(id, value) {
    return new Promise((resolve, reject) => {
      cacheClient.set({
        segment: 'logins',
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
