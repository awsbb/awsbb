'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _catbox = require('catbox');

var _catbox2 = _interopRequireDefault(_catbox);

var _catboxRedis = require('catbox-redis');

var _catboxRedis2 = _interopRequireDefault(_catboxRedis);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var boomError = function boomError(_ref) {
  var message = _ref.message;
  var _ref$code = _ref.code;
  var code = _ref$code === undefined ? 500 : _ref$code;

  var boomData = _boom2.default.wrap(new Error(message), code).output.payload;
  return new Error(JSON.stringify(boomData));
};

var cacheClient = null;

var decode = function decode(authorization) {
  return new _bluebird2.default(function (resolve, reject) {
    var parts = authorization.split(/\s+/);
    if (parts[0] && parts[0].toLowerCase() !== 'bearer') {
      return reject(boomError({
        message: 'Bearer',
        code: 401
      }));
    }
    if (parts.length !== 2) {
      return reject(boomError({
        message: 'Bad HTTP Authentication Header Format',
        code: 400
      }));
    }
    if (parts[1].split('.').length !== 3) {
      return reject(boomError({
        message: 'Bad HTTP Authentication Header Format',
        code: 400
      }));
    }
    var token = parts[1];
    _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        if (err.message === 'jwt expired') {
          return reject(boomError({
            message: 'Expired token received for JSON Web Token validation',
            code: 401
          }));
        }
        return reject(boomError({
          message: 'Invalid signature received for JSON Web Token validation',
          code: 401
        }));
      }
      resolve(decoded);
    });
  });
};

var Cache = function Cache(_ref2) {
  var _this = this;

  var _ref2$endpoint = _ref2.endpoint;
  var endpoint = _ref2$endpoint === undefined ? '127.0.0.1:6379' : _ref2$endpoint;
  var _ref2$password = _ref2.password;
  var password = _ref2$password === undefined ? '' : _ref2$password;

  _classCallCheck(this, Cache);

  this.start = function () {
    return new _bluebird2.default(function (resolve, reject) {
      cacheClient.start(function (err) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  };

  this.stop = function () {
    return new _bluebird2.default(function (resolve) {
      cacheClient.stop();
      resolve();
    });
  };

  this.authorizeUser = function (_ref3) {
    var userEmail = _ref3.userEmail;
    var headers = _ref3.headers;

    var authorization = headers.authorization;
    var userSessionID = headers['x-awsbb-sessionid'];
    if (!authorization) {
      return _bluebird2.default.reject(boomError('Bearer', 401));
    }
    return _this.get({
      segment: 'logins',
      id: userSessionID
    }).then(function (_ref4) {
      var value = _ref4.value;

      // get the decoded value of what's in the cache
      return decode('Bearer ' + value).then(function (_ref5) {
        var email = _ref5.email;
        var sessionID = _ref5.sessionID;

        return _bluebird2.default.resolve({
          cacheEmail: email,
          cacheSessionID: sessionID
        });
      }).then(function (_ref6) {
        var cacheEmail = _ref6.cacheEmail;
        var cacheSessionID = _ref6.cacheSessionID;

        // get the decoded value of what was sent in headers
        return decode(authorization).then(function (_ref7) {
          var email = _ref7.email;
          var sessionID = _ref7.sessionID;

          // compare all three areas of information
          var userInfo = {
            email: userEmail,
            sessionID: userSessionID
          };
          var cacheInfo = {
            email: cacheEmail,
            sessionID: cacheSessionID
          };
          var authorizationInfo = {
            email: email,
            sessionID: sessionID
          };
          var valid = _underscore2.default.isEqual(userInfo, cacheInfo) && _underscore2.default.isEqual(userInfo, authorizationInfo) && _underscore2.default.isEqual(cacheInfo, authorizationInfo);
          if (valid) {
            return _bluebird2.default.resolve();
          }
          return _bluebird2.default.reject(boomError({
            message: 'Unauthorized Session',
            code: 401
          }));
        });
      });
    });
  };

  this.get = function (_ref8) {
    var _ref8$segment = _ref8.segment;
    var segment = _ref8$segment === undefined ? 'cache' : _ref8$segment;
    var id = _ref8.id;

    return new _bluebird2.default(function (resolve, reject) {
      cacheClient.get({
        segment: segment,
        id: id
      }, function (err, cached) {
        if (err) {
          return reject(err);
        }
        if (cached && cached.item) {
          return resolve(cached.item);
        }
        reject(boomError({
          message: 'Unauthorized',
          code: 401
        }));
      });
    });
  };

  this.drop = function (_ref9) {
    var _ref9$segment = _ref9.segment;
    var segment = _ref9$segment === undefined ? 'cache' : _ref9$segment;
    var id = _ref9.id;

    return new _bluebird2.default(function (resolve, reject) {
      cacheClient.drop({
        segment: segment,
        id: id
      }, function (err) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  };

  this.set = function (_ref10) {
    var _ref10$segment = _ref10.segment;
    var segment = _ref10$segment === undefined ? 'cache' : _ref10$segment;
    var id = _ref10.id;
    var value = _ref10.value;

    return new _bluebird2.default(function (resolve, reject) {
      cacheClient.set({
        segment: segment,
        id: id
      }, {
        value: value,
        accessed: new Date(_moment2.default.utc().format())
      }, 60 * 1000, function (err) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  };

  cacheClient = new _catbox2.default.Client(_catboxRedis2.default, {
    partition: 'catbox-awsBB',
    host: endpoint.split(':')[0],
    port: endpoint.split(':')[1],
    password: password
  });
};

exports.default = Cache;