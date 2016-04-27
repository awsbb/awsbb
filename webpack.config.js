const rucksack = require('rucksack-css');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  // where does my source directory live
  context: path.join(__dirname, './webpack'),
  // not sure but it makes source maps
  devtool: 'source-map',
  // some sort of crazy config object that gives me stats and colors
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
    // where is the main entry point to my application
    jsx: [
      'webpack-hot-middleware/client',
      './application.jsx'
    ],
    // I want react to be split off from the combined js files and put into a "vendor" file. It's named in the CommonsChunkPlugin
    vendor: [
      'react'
    ]
  },
  output: {
    // where to put the concated/compiled/blah/blah application file (no vendor code)
    path: path.join(__dirname, 'distribution'),
    // what to call the file
    filename: 'application.min.js'
  },
  module: {
    // for .js and .jsx files use babel as a "loader" which does some preprocessing and gives me ES6 stuff
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: [
        'react-hot',
        'babel'
      ]
    }, {
      // for .css files, make sure to autoprefix vendor specific tags with the postcss module, see below
      test: /\.css$/,
      loaders: [
        'style',
        'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss'
      ]
    }]
  },
  resolve: {
    // found some docs, looks like it resolves module paths for these file extensions
    // like require('./file'), require('./file.js'), require('./file.jsx')
    extensions: ['', '.js', '.jsx']
  },
  postcss: [
    // prefix vendor stuff on the css
    rucksack({
      autoprefixer: true
    })
  ],
  plugins: [
    // for these variables if used in a global way in the code, use the following libraries instead of browser defaults
    new webpack.ProvidePlugin({
      Promise: 'es6-promise',
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    // I don't even know... but skips the error reporting phase and continues on??? that way hotreplacement/etc doesn't bail out.
    new webpack.NoErrorsPlugin(),
    // let's combine our vendor code into it's own file!
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.min.js'),
    // define free variables, such as adding global constants
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),
    // helps replace stuff after changes are made
    new webpack.HotModuleReplacementPlugin()
  ],
  // saw it someplace else, though it might be a good idea
  devServer: {
    contentBase: './webpack',
    hot: true
  }
};
