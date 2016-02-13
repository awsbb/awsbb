const rucksack = require('rucksack-css');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.join(__dirname, './webpack'),
  devtool: 'eval-source-map',
  assets: {
    stats: {
      assets: true,
      colors: true,
      version: true,
      hash: true,
      timings: true,
      chunks: false,
      chunkModules: false
    }
  },
  entry: {
    jsx: [
      'webpack-hot-middleware/client',
      './application.jsx'
    ],
    vendor: [
      'react'
    ]
  },
  output: {
    path: path.join(__dirname, 'distribution'),
    filename: 'application.min.js'
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
    new webpack.ProvidePlugin({
      Promise: 'es6-promise',
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
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
