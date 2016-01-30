import Boom from 'boom';

import crypto from 'crypto';
import Promise from 'bluebird';

const boomError = (message, code = 500) => {
  const boomData = Boom.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

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
          salt,
          hash: key.toString('base64')
        });
      });
    });
  }
  const randomBytes = new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, salt) => {
      if (err) {
        return reject(err);
      }
      salt = salt.toString('base64');
      resolve(salt);
    });
  });
  return randomBytes
    .then((salt) => computeHash(password, salt));
}
