'use strict';

import * as AuthChangePassword from '../aws/lambda/AuthChangePassword';
import * as AuthCreateUser from '../aws/lambda/AuthCreateUser';
import * as AuthLogin from '../aws/lambda/AuthLogin';
import * as AuthLostPassword from '../aws/lambda/AuthLostPassword';
import * as AuthResetPassword from '../aws/lambda/AuthResetPassword';
import * as AuthVerifyUser from '../aws/lambda/AuthVerifyUser';

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
