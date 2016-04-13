#!/bin/sh

LAUNCH_DIR=${PWD}

./node_modules/.bin/lab tests/ -m 10000 -l -v -c -r console -o stdout -r console -o reports/coverage.txt -r html -o reports/coverage.html -r json -o reports/coverage.json

lambdaFunctions=(./server/aws/lambda/*);
customNPMModules=(./server/aws/npm/@awsbb/*);

for directory in "${lambdaFunctions[@]}"; do
  cd $directory
  if [ ! -d node_modules ]; then
    npm i
  fi
  npm test
  cd $LAUNCH_DIR
done

for directory in "${customNPMModules[@]}"; do
  cd $directory
  if [ ! -d node_modules ]; then
    npm i
  fi
  npm test
  cd $LAUNCH_DIR
done

cd $LAUNCH_DIR
