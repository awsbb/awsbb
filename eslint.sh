#!/bin/sh

LAUNCH_DIR=${PWD}

npm run eslint

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
