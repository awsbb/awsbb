export default {
  MG_API_KEY: 'key-123412341234123412341234123412341234',
  MG_DOMAIN: 'awsbb.com',

  DEVELOPER_PROVIDER_NAME: 'awsbb.com',
  EXTERNAL_NAME: 'awsBB',
  EMAIL_SOURCE: 'administrator@awsbb.com',
  VERIFICATION_PAGE: 'http://127.0.0.1:3000/#/verify',
  RESET_PAGE: 'http://127.0.0.1:3000/#/reset',

  JWT_SECRET: 'NOTSECRET!!!',

  REGION: 'us-west-2',
  EC_ENDPOINT: '127.0.0.1:6379',
  DDB_ENDPOINT: 'http://127.0.0.1:8000',
  DDB_Tables: [{
    TableName: 'awsBB_Users',
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    KeySchema: [{
      AttributeName: 'email',
      KeyType: 'HASH'
    }],
    AttributeDefinitions: [{
      AttributeName: 'email',
      AttributeType: 'S'
    }]
  }]
};
