'use strict';

var webpack = require('webpack');
var path = require('path');

var entries = [
  'webpack-hot-middleware/client',
  './webpack/src/app.jsx'
];

module.exports = {
  devtool: 'eval-source-map',
  entry: entries,
  assets: {
    stats: {
      colors: true
    }
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.min.js'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loaders: [
        'react-hot',
        'babel'
      ],
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
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
