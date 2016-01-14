'use strict';

var rucksack = require('rucksack-css');
var webpack = require('webpack');
var path = require('path');

var entries = [
  'webpack-hot-middleware/client',
  './app.jsx'
];

module.exports = {
  context: path.join(__dirname, './webpack'),
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
      exclude: /(node_modules)/
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /(node_modules)/
    }, {
      test: /\.css$/,
      loaders: [
        'style',
        'css',
        'postcss'
      ],
      exclude: /(node_modules)/
    }]
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ],
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
