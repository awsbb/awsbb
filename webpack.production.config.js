'use strict';

var webpack = require('webpack');
var path = require('path');
var entries = path.resolve(__dirname, 'webpack/src/', 'app.jsx');
// var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var CompressionPlugin = require('compression-webpack-plugin');
var pkg = require('./package.json');

module.exports = {
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
      // query: {
      //     cacheDirectory: true,
      //     presets: ['es2015']
      // },
      exclude: /(node_modules|static|dist)/,
      include: /src/
    }, {
      test: /\.js$/,
      loader: 'babel',
      // query: {
      //     cacheDirectory: true,
      //     presets: ['es2015']
      // },
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
    new webpack.BannerPlugin(pkg.name + ' v' + pkg.version + ' ' + new Date()),
    new CompressionPlugin()
  ]
};
