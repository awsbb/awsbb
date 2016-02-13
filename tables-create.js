require('babel-register');
require('babel-polyfill');

const Config = require('./config.js').default;

const async = require('async');
const AWS = require('aws-sdk');

const DynamoDB = new AWS.DynamoDB({
  region: Config.REGION,
  endpoint: new AWS.Endpoint(Config.DDB_ENDPOINT)
});

const DDBTables = Config.DDB_Tables;

async.whilst(
  () => {
    return DDBTables.length;
  },
  (cb) => {
    const table = DDBTables.shift();
    DynamoDB.createTable(table, (err) => {
      if (err && err.message === 'Cannot create preexisting table') {
        return cb();
      }
      return cb(err);
    });
  },
  (err) => {
    if (err) {
      console.log('Table Creation Failed!');
      console.log(err);
      process.exit(1);
    }
    console.log('Tables Created!');
    process.exit();
  }
);
