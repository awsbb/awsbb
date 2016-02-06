import crypto from 'crypto';
import Promise from 'bluebird';

const length = 128;
const iterations = 4096;

export function computeHash({ password, salt = crypto.randomBytes(length).toString('base64') }) {
  return new Promise((resolve) => {
    const hash = crypto.pbkdf2Sync(password, salt, iterations, length).toString('base64');
    resolve({
      salt,
      hash
    });
  });
}
