'use strict';

import { handler as authChangePassword } from '../aws/lambda/AuthChangePassword';
import { handler as authCreateUser } from '../aws/lambda/AuthCreateUser';
import { handler as authLogin } from '../aws/lambda/AuthLogin';
import { handler as authLostPassword } from '../aws/lambda/AuthLostPassword';
import { handler as authResetPassword } from '../aws/lambda/AuthResetPassword';
import { handler as authVerifyUser } from '../aws/lambda/AuthVerifyUser';

export function setup(server) {
  server.route({
    method: 'PATCH',
    path: '/api/AuthChangePassword',
    config: {
      handler: (request, reply) => {
        authChangePassword(server.getEvent(request), server.getContext(reply));
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/AuthCreateUser',
    config: {
      handler: (request, reply) => {
        authCreateUser(server.getEvent(request), server.getContext(reply));
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/AuthLogin',
    config: {
      handler: (request, reply) => {
        authLogin(server.getEvent(request), server.getContext(reply));
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/AuthLostPassword',
    config: {
      handler: (request, reply) => {
        authLostPassword(server.getEvent(request), server.getContext(reply));
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/AuthResetPassword',
    config: {
      handler: (request, reply) => {
        authResetPassword(server.getEvent(request), server.getContext(reply));
      }
    }
  });
  server.route({
    method: 'POST',
    path: '/api/AuthVerifyUser',
    config: {
      handler: (request, reply) => {
        authVerifyUser(server.getEvent(request), server.getContext(reply));
      }
    }
  });
};
