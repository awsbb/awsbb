#!/bin/sh

LAUNCH_DIR=${PWD}

echo '[app.min.js] File Size (before):'
ls -lah distribution/application.min.js | awk '{ print $5}'
echo '[vendor.min.js] File Size (before):'
ls -lah distribution/vendor.min.js | awk '{ print $5}'

NODE_ENV=production ./node_modules/.bin/webpack -p --config webpack.production.config.js --progress --colors

lambdaFunctions=(./server/aws/lambda/*);
customNPMModules=(./server/aws/npm/@awsbb/*);

for directory in "${lambdaFunctions[@]}"; do
  cd $directory
  if [ ! -d node_modules ]; then
    npm i
  fi
  npm run build
  cd $LAUNCH_DIR
done

for directory in "${customNPMModules[@]}"; do
  cd $directory
  if [ ! -d node_modules ]; then
    npm i
  fi
  npm run build
  cd $LAUNCH_DIR
done

cd $LAUNCH_DIR
