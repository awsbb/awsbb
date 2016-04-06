#!/bin/sh

LAUNCH_DIR=${PWD}

rm -rf node_modules/

customNPMModules=(./server/aws/npm/@awsbb/*);
lambdaFunctions=(./server/aws/lambda/*);

for directory in "${customNPMModules[@]}"; do
  cd $directory
  npm update
  cd $LAUNCH_DIR
done

for directory in "${lambdaFunctions[@]}"; do
  cd $directory
  npm update
  cd $LAUNCH_DIR
done

cd $LAUNCH_DIR
