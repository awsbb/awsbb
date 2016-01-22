'use strict';

var rucksack = require('rucksack-css');
var webpack = require('webpack');
var path = require('path');
var CompressionPlugin = require('compression-webpack-plugin');
var pkg = require('./package.json');

module.exports = {
  context: path.join(__dirname, './webpack'),
  devtool: 'source-map',
  assets: {
    stats: {
      colors: true
    }
  },
  entry: {
    jsx: [
      './application.jsx'
    ],
    vendor: [
      'react'
    ]
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'application.min.js'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: [
        'babel'
      ]
    }, {
      test: /\.css$/,
      loaders: [
        'style',
        'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss'
      ]
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ],
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'es6-promise',
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.min.js'),
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),
    new webpack.BannerPlugin(pkg.name + ' v' + pkg.version + ' ' + new Date()),
    new CompressionPlugin()
  ]
};
