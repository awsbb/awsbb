#!/bin/sh

LAUNCH_DIR=${PWD}

./node_modules/.bin/eslint --ext .js --ext .jsx --quiet ./webpack/* ./tests/* ./*.js

lambdaFunctions=(./server/aws/lambda/*);
customNPMModules=(./server/aws/npm/@awsbb/*);

for directory in "${lambdaFunctions[@]}"; do
  cd $directory
  if [ ! -d "node_modules" ]; then
    npm i
  fi
  npm run eslint
  cd $LAUNCH_DIR
done

for directory in "${customNPMModules[@]}"; do
  cd $directory
  if [ ! -d "node_modules" ]; then
    npm i
  fi
  npm run eslint
  cd $LAUNCH_DIR
done

cd $LAUNCH_DIR
