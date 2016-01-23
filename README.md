# awsBB

Serverless AWS based forum software (In-Progress)

### Directories:

* ./webpack
	* Client source.
* ./static
	* Compiled distribution to be hosted on a S3 bucket.
* ./plugin
	* General store for server side local development.
* ./plugin/aws/
	* AWS code in abstracted form to utilize local installs.
* ./plugin/route-maps
	* Lambda->HapiJS route translation.

This README and project is still highly unstable since it just began. It's being built up piece by piece.

The routes you will see also are **not** REST compliant until a more finalized version is complete; that and the API's will not be designed for 3rd party consumption. (TBD)

### Technologies & Installables:

* [async](https://github.com/caolan/async#readme)
* [aws-sdk](https://github.com/aws/aws-sdk-js)
* [babel](https://babeljs.io/)
* [babel-core](https://babeljs.io/)
* [babel-eslint](https://github.com/babel/babel-eslint)
* [babel-loader](https://github.com/babel/babel-loader)
* babel-plugin-transform-runtime
* [babel-polyfill](https://babeljs.io/)
* [babel-preset-es2015](https://babeljs.io/)
* [babel-preset-react](https://babeljs.io/)
* [babel-preset-stage-0](https://babeljs.io/)
* babel-runtime
* [bluebird](https://github.com/petkaantonov/bluebird)
* [classnames](https://github.com/JedWatson/classnames#readme)
* [compression-webpack-plugin](http://github.com/webpack/compression-webpack-plugin)
* [css-loader](https://github.com/webpack/css-loader#readme)
* [eslint](http://eslint.org)
* [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)
* [exports-loader](https://github.com/webpack/exports-loader)
* [file-loader](https://github.com/webpack/file-loader)
* [flux](http://facebook.github.io/flux/)
* [font-awesome](http://fontawesome.io/)
* [gulp](http://gulpjs.com)
* [gulp-eslint](https://github.com/adametry/gulp-eslint#readme)
* [gulp-lab](https://github.com/otodockal/gulp-lab)
* [gulp-param](https://github.com/stoeffel/gulp-param)
* [hapi](http://hapijs.com)
* [hapi-webpack-plugin](https://github.com/SimonDegraeve/hapi-webpack-plugin)
* [history](https://github.com/rackt/history#readme)
* [imports-loader](https://github.com/webpack/imports-loader#readme)
* [inert](https://github.com/hapijs/inert#readme)
* [joi](https://github.com/hapijs/joi)
* [lab](https://github.com/hapijs/lab#readme)
* [lodash](https://lodash.com/)
* [nodemailer](http://nodemailer.com/)
* [nodemailer-mailgun-transport](http://mailgun.com)
* [nodemon](http://nodemon.io)
* [postcss-loader](https://github.com/postcss/postcss-loader#readme)
* [postcss-modules](https://github.com/outpunk/postcss-modules#readme)
* [prettydiff](http://prettydiff.com/)
* [react](https://github.com/facebook/react/tree/master/npm-react)
* [react-addons-css-transition-group](https://github.com/facebook/react#readme)
* [react-bootstrap](http://react-bootstrap.github.io/)
* [react-dom](https://github.com/facebook/react/tree/master/npm-react-dom)
* [react-fontawesome](https://github.com/danawoodman/react-fontawesome#readme)
* [react-hot-loader](https://github.com/gaearon/react-hot-loader)
* [react-redux](https://github.com/gaearon/react-redux)
* [react-router](https://rackt.github.io/react-router/)
* [react-tap-event-plugin](http://facebook.github.io/react)
* [redux](http://rackt.github.io/redux)
* [redux-actions](https://github.com/acdlite/redux-actions)
* [redux-devtools](https://github.com/gaearon/redux-devtools)
* [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor)
* [redux-devtools-log-monitor](https://github.com/gaearon/redux-devtools-log-monitor)
* [redux-logger](https://github.com/fcomb/redux-logger#readme)
* [redux-persist](https://github.com/rt2zz/redux-persist)
* [redux-simple-router](https://github.com/rackt/redux-simple-router#readme)
* [redux-thunk](https://github.com/gaearon/redux-thunk)
* [rucksack-css](https://github.com/simplaio/rucksack)
* [string-format](https://github.com/davidchambers/string-format)
* [style-loader](https://github.com/webpack/style-loader#readme)
* [underscore](http://underscorejs.org)
* [vision](https://github.com/hapijs/vision#readme)
* [webpack](https://github.com/webpack/webpack)
* [webpack-dev-server](http://github.com/webpack/webpack-dev-server)
* [whatwg-fetch](https://github.com/github/fetch#readme)

### Configuration

By default a global.Config option is setup both locally and from the package.json of each lambda when deployed in production. I would recommend setting up a local-config.json in the root of this project and inputing your own values for testing.

I've setup the system so that nodemailer and mailgun are used in place of SES for local development. You will need to setup a domain and key to utilize that. For your own just make the file and copy out the config data in the main package.json. :)

### Installation

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

*Please Note*:
You may see items committed here and there which is just me or someone else learning something along the way.
