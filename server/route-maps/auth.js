import { handler as authChangePassword } from '@awsbb/auth-change-password';
import { handler as authCreateUser } from '@awsbb/auth-create-user';
import { handler as authLogin } from '@awsbb/auth-login';
import { handler as authLogout } from '@awsbb/auth-logout';
import { handler as authLostPassword } from '@awsbb/auth-lost-password';
import { handler as authResetPassword } from '@awsbb/auth-reset-password';
import { handler as authVerifyUser } from '@awsbb/auth-verify-user';

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
    path: '/api/AuthLogout',
    config: {
      handler: (request, reply) => {
        authLogout(server.getEvent(request), server.getContext(reply));
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
}
