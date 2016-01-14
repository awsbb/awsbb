'use strict';

var rucksack = require('rucksack-css');
var webpack = require('webpack');
var path = require('path');
var CompressionPlugin = require('compression-webpack-plugin');
var pkg = require('./package.json');

var entries = [
  './app.jsx'
];

module.exports = {
  context: path.join(__dirname, './webpack'),
  devtool: 'source-map',
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
      loader: 'babel',
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      minimize: true,
      output: {
        comments: false
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.BannerPlugin(pkg.name + ' v' + pkg.version + ' ' + new Date()),
    new CompressionPlugin()
  ]
};
