import pkg from '../package.json';
import _ from 'lodash';

const DefaultHeaders = ['authorization', 'content-type', 'if-none-match'];

exports.register = (server, options, next) => {
  server.path(__dirname);

  server.getEvent = (request) => {
    const data = {
      payload: request.payload,
      headers: request.headers,
      method: request.method,
      params: request.params,
      query: request.query
    };
    request.log('event', data);
    return data;
  };

  server.getContext = (reply) => {
    return {
      succeed: (data) => {
        reply(data);
      },
      fail: (error) => {
        const response = {
          errorMessage: error.message,
          errorType: 'Error'
        };
        response.stackTrace = [];
        if (error.stack) {
          response.stackTrace.push(error.stack);
        }
        reply(response);
      }
    };
  };

  // AJAX CALLS
  server.route({
    method: 'OPTIONS',
    path: '/api/{param*}',
    config: {
      auth: false,
      handler: (request, reply) => {
        let requestHeaders = [];
        if (request.headers['access-control-request-headers']) {
          requestHeaders = request.headers['access-control-request-headers'].split(', ');
        }
        reply().type('text/plain')
          .header('Access-Control-Allow-Headers', _.union(DefaultHeaders, requestHeaders).join(', '));
      }
    }
  });

  // Let's use nodemailer/mailgun to start sending out emails from our localmachine only
  global.SES = require('./mailer');

  const router = require('./router.js');

  router.mapRoutes(server)
    .then(() => {
      process.nextTick(() => {
        next();
      });
    })
    .catch((err) => {
      process.nextTick(() => {
        next(err);
      });
    });
};

exports.register.attributes = {
  pkg: pkg
};
