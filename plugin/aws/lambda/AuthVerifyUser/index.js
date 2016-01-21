'use strict';

var pkg = require('./package.json');

var crypto = require('crypto');

var Promise = require('bluebird');
global.Config = pkg.config;

var AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

var length = 128;
var iterations = 4096;

function computeHash(password, salt) {
  return new Promise(function (resolve, reject) {
    crypto.pbkdf2(password, salt, iterations, length, function (err, key) {
      if (err) {
        return reject(err);
      }
      return resolve([salt, key.toString('base64')]);
    });
  });
}

function generateHash(password, salt) {
  return new Promise(function (resolve, reject) {
    if (salt) {
      computeHash(password, salt)
        .then(resolve)
        .catch(reject);
    }
    crypto.randomBytes(length, function (err, salt) {
      if (err) {
        return reject(err);
      }
      computeHash(password, salt.toString('base64'))
        .then(resolve)
        .catch(reject);
    });
  });
}

exports.handler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);
  context.succeed({
    success: true
  });
};
