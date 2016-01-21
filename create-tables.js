'use strict';

var async = require('async');
var pkg = require('./package.json');

global.Config = pkg.config;

var AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB({
  region: Config.AWS.REGION,
  endpoint: new AWS.Endpoint(Config.AWS.DDB_ENDPOINT)
});

var DDBTables = Config.AWS.DDBTables;

async.whilst(
  function () {
    return DDBTables.length;
  },
  function (cb) {
    var table = DDBTables.shift();
    dynamodb.createTable(table, function (err) {
      if (err && err.message === 'Cannot create preexisting table') {
        return cb();
      }
      cb(err);
    });
  },
  function (err) {
    if (err) {
      console.log('Table Creation Failed!');
      console.log(err);
      process.exit(1);
    }
    console.log('Tables Created!');
    process.exit();
  }
);
