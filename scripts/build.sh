#!/bin/sh

LAUNCH_DIR=${PWD}

echo '[app.min.js] File Size (before):'
ls -lah distribution/application.min.js | awk '{ print $5}'
echo '[vendor.min.js] File Size (before):'
ls -lah distribution/vendor.min.js | awk '{ print $5}'

NODE_ENV=production ./node_modules/.bin/webpack -p --config webpack.production.config.js --progress --colors
