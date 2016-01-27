'use strict';

import crypto from 'crypto';
import Promise from 'bluebird';

const length = 128;
const iterations = 4096;

export function computeHash(password, salt) {
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
