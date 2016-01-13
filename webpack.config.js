'use strict';

var webpack = require('webpack');
var path = require('path');

var entries = [
  'webpack/hot/only-dev-server',
  './src/app.jsx'
];

module.exports = {
  devtool: 'eval-source-map',
  entry: entries,
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.min.js'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loaders: ['react-hot', 'babel'],
      exclude: /(node_modules|static|dist)/,
      include: /src/
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /(node_modules|static|dist)/,
      include: /src/
    }, {
      test: /\.css$/,
      loader: 'style!css',
      exclude: /(node_modules|static|dist)/,
      include: /src/
    }]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
