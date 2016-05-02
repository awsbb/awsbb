# awsbb
[![Join the chat at https://gitter.im/awsbb/awsbb](https://badges.gitter.im/awsbb/awsbb.svg)](https://gitter.im/awsbb/awsbb?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Serverless AWS based forum software (In-Progress)

## Diagrams:
- [AuthChangePassword](https://github.com/awsbb/auth-change-password/blob/master/diagrams/AUTHCHANGEPASSWORD.md)
- [AuthCreateUser](https://github.com/awsbb/auth-create-user/blob/master/diagrams/AUTHCREATEUSER.md)
- [AuthLogin](https://github.com/awsbb/auth-login/blob/master/diagrams/AUTHLOGIN.md)
- [AuthLogout](https://github.com/awsbb/auth-logout/blob/master/diagrams/AUTHLOGOUT.md)
- [AuthLostPassword](https://github.com/awsbb/auth-lost-password/blob/master/diagrams/AUTHLOSTPASSWORD.md)
- [AuthResetPassword](https://github.com/awsbb/auth-reset-password/blob/master/diagrams/AUTHRESETPASSWORD.md)
- [AuthVerifyUser](https://github.com/awsbb/auth-verify-user/blob/master/diagrams/AUTHVERIFYUSER.md)

## Directories:
- ./webpack
  - Client source.

- ./distribution
  - Compiled distribution to be hosted on a S3 bucket.

- ./server
  - General store for server side local development.

This README and project is still highly unstable since it just began. It's being built up piece by piece.

The routes you will see also are **not** REST compliant until a more finalized version is complete; that and the API's will not be designed for 3rd party consumption. (TBD)

## Technologies & Installables:
- [@awsbb/auth-change-password](http://awsbb.com)
- [@awsbb/auth-create-user](http://awsbb.com)
- [@awsbb/auth-login](http://awsbb.com)
- [@awsbb/auth-logout](http://awsbb.com)
- [@awsbb/auth-lost-password](http://awsbb.com)
- [@awsbb/auth-reset-password](http://awsbb.com)
- [@awsbb/auth-verify-user](http://awsbb.com)
- [@awsbb/forum-categories-get](http://awsbb.com)
- [@awsbb/forum-replies-get](http://awsbb.com)
- [@awsbb/forum-threads-get](http://awsbb.com)
- [async](https://github.com/caolan/async#readme)
- [babel-cli](https://babeljs.io/)
- [babel-eslint](https://github.com/babel/babel-eslint)
- [babel-loader](https://github.com/babel/babel-loader)
- babel-plugin-transform-es2015-modules-commonjs
- [babel-polyfill](https://babeljs.io/)
- [babel-preset-es2015](https://babeljs.io/)
- [babel-preset-react](https://babeljs.io/)
- [babel-preset-stage-0](https://babeljs.io/)
- babel-register
- [bluebird](https://github.com/petkaantonov/bluebird)
- [classnames](https://github.com/JedWatson/classnames#readme)
- [compression-webpack-plugin](http://github.com/webpack/compression-webpack-plugin)
- [css-loader](https://github.com/webpack/css-loader#readme)
- [eslint](http://eslint.org)
- [eslint-plugin-babel](https://github.com/babel/eslint-plugin-babel#readme)
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)
- [exports-loader](https://github.com/webpack/exports-loader#readme)
- [file-loader](https://github.com/webpack/file-loader)
- [font-awesome](http://fontawesome.io/)
- [good](https://github.com/hapijs/good#readme)
- [good-console](https://github.com/hapijs/good-console#readme)
- [good-squeeze](https://github.com/hapijs/good-squeeze)
- [hapi](http://hapijs.com)
- [hapi-webpack-plugin](https://github.com/SimonDegraeve/hapi-webpack-plugin)
- [history](https://github.com/mjackson/history#readme)
- [imports-loader](https://github.com/webpack/imports-loader#readme)
- [inert](https://github.com/hapijs/inert#readme)
- [lab](https://github.com/hapijs/lab#readme)
- [lodash](https://lodash.com/)
- [nodemailer](http://nodemailer.com/)
- [nodemailer-mailgun-transport](http://mailgun.com)
- [nodemon](http://nodemon.io)
- [npm-check](https://github.com/dylang/npm-check)
- [postcss-loader](https://github.com/postcss/postcss-loader#readme)
- [postcss-modules](https://github.com/outpunk/postcss-modules#readme)
- [prettydiff](http://prettydiff.com/)
- [react](https://facebook.github.io/react/)
- [react-addons-css-transition-group](https://github.com/facebook/react#readme)
- [react-bootstrap](http://react-bootstrap.github.io/)
- [react-dom](https://facebook.github.io/react/)
- [react-fontawesome](https://github.com/danawoodman/react-fontawesome#readme)
- [react-hot-loader](https://github.com/gaearon/react-hot-loader)
- [react-redux](https://github.com/gaearon/react-redux)
- [react-router](https://github.com/reactjs/react-router#readme)
- [react-router-redux](https://github.com/reactjs/react-router-redux#readme)
- [react-tap-event-plugin](http://facebook.github.io/react)
- [redux](http://redux.js.org)
- [redux-actions](https://github.com/acdlite/redux-actions)
- [redux-devtools](https://github.com/gaearon/redux-devtools)
- [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor)
- [redux-devtools-log-monitor](https://github.com/gaearon/redux-devtools-log-monitor)
- [redux-logger](https://github.com/fcomb/redux-logger#readme)
- [redux-persist](https://github.com/rt2zz/redux-persist)
- [redux-thunk](https://github.com/gaearon/redux-thunk)
- [rucksack-css](https://github.com/simplaio/rucksack)
- [style-loader](https://github.com/webpack/style-loader#readme)
- [vision](https://github.com/hapijs/vision#readme)
- [webpack](https://github.com/webpack/webpack)
- [webpack-dev-server](http://github.com/webpack/webpack-dev-server)
- [whatwg-fetch](https://github.com/github/fetch#readme)

## Configuration
By default a global.Config option is setup both locally and from the package.json of each lambda when deployed in production. I would recommend setting up a local-config.json in the root of this project and inputing your own values for testing.

I've setup the system so that nodemailer and mailgun are used in place of SES for local development. You will need to setup a domain and key to utilize that. For your own just make the file and copy out the config data in the main package.json. :)

## Installation

```shell
# if you are using a local DynamoDB you can do so with: (OSX)
# brew install dynamodb-local
# I'd recommend having it auto start but if not it will be available at http://127.0.0.1:8000
git clone git@github.com:awsbb/awsbb.git
npm i
node tables-create.js
npm start
```

If something doesn't run you may need somethings in your global packages.

Module versioning is nothing I'm worried about right now because it's all still in development. Things can and will break! :)

This package setup supports HMR of both the client and the server.

_Please Note_: You may see items committed here and there which is just me or someone else learning something along the way.
