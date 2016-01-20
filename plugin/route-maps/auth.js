'use strict';

const AuthChangePassword = require('../aws/lambda/AuthChangePassword');
const AuthCreateUser = require('../aws/lambda/AuthCreateUser');
const AuthLogin = require('../aws/lambda/AuthLogin');
const AuthLostPassword = require('../aws/lambda/AuthLostPassword');
const AuthResetPassword = require('../aws/lambda/AuthResetPassword');
const AuthVerifyUser = require('../aws/lambda/AuthVerifyUser');

export function setup(server) {
  server.route({
    method: 'PATCH',
    path: '/api/AuthChangePassword',
    config: {
      handler: (request, reply) => {
        AuthChangePassword.handler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/AuthCreateUser',
    config: {
      handler: (request, reply) => {
        AuthCreateUser.handler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/AuthLogin',
    config: {
      handler: (request, reply) => {
        AuthLogin.handler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/AuthLostPassword',
    config: {
      handler: (request, reply) => {
        AuthLostPassword.handler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/AuthResetPassword',
    config: {
      handler: (request, reply) => {
        AuthResetPassword.handler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/AuthVerifyUser',
    config: {
      handler: (request, reply) => {
        AuthVerifyUser.handler(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
