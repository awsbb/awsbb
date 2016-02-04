#!/bin/sh

LAUNCH_DIR=${PWD}

npm test

lambdaFunctions=(./server/aws/lambda/*);
customNPMModules=(./server/aws/npm/@awsbb/*);

for directory in "${lambdaFunctions[@]}"; do
  cd $directory
  if [ ! -d "node_modules" ]; then
    npm i
  fi
  npm test
  cd $LAUNCH_DIR
done

for directory in "${customNPMModules[@]}"; do
  cd $directory
  if [ ! -d "node_modules" ]; then
    npm i
  fi
  npm test
  cd $LAUNCH_DIR
done

cd $LAUNCH_DIR
