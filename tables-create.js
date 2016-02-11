'use strict';

const Config = require('./config.json');

var async = require('async');
var AWS = require('aws-sdk');

var DynamoDB = new AWS.DynamoDB({
  region: Config.REGION,
  endpoint: new AWS.Endpoint(Config.DDB_ENDPOINT)
});

var DDBTables = Config.DDB_Tables;

async.whilst(
  function () {
    return DDBTables.length;
  },
  function (cb) {
    var table = DDBTables.shift();
    DynamoDB.createTable(table, function (err) {
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
