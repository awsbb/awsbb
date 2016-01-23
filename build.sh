#!/bin/sh

LAUNCH_DIR=${PWD}

echo '[app.min.js] File Size (before):'
ls -lah static/application.min.js | awk '{ print $5}'
echo '[vendor.min.js] File Size (before):'
ls -lah static/vendor.min.js | awk '{ print $5}'
NODE_ENV=production webpack -p --config webpack.production.config.js --progress --colors

lambdaFunctions=(./plugin/aws/lambda/*);

for directory in "${lambdaFunctions[@]}"; do
  cd $directory
  if [ ! -d "node_modules" ]; then
    npm i
  fi
  npm run build
  cd $LAUNCH_DIR
done

cd $LAUNCH_DIR
