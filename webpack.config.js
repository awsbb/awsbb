'use strict';

var rucksack = require('rucksack-css');
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, './webpack'),
  devtool: 'eval-source-map',
  assets: {
    stats: {
      colors: true
    }
  },
  entry: {
    jsx: [
      'webpack-hot-middleware/client',
      './app.jsx'
    ],
    vendor: [
      'react'
    ]
  },
  output: {
    path: path.join(__dirname, './static'),
    filename: 'app.min.js'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: [
        'react-hot',
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
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.min.js'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './webpack',
    hot: true
  }
};
