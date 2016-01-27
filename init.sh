#!/bin/sh

LAUNCH_DIR=${PWD}

if [ ! -d "node_modules" ]; then
  npm i
fi

lambdaFunctions=(./server/aws/lambda/*);
customNPMModules=(./server/aws/npm/@awsbb/*);

for directory in "${lambdaFunctions[@]}"; do
  cd $directory
  if [ ! -d "node_modules" ]; then
    npm i
  fi
  cd $LAUNCH_DIR
done

for directory in "${customNPMModules[@]}"; do
  IFS='@' read -r -a array <<< "$directory"
  plugin="@${array[1]}"
  cd $directory
  if [ ! -d "node_modules" ]; then
    npm i
  fi
  npm link
  cd $LAUNCH_DIR
  for directory in "${lambdaFunctions[@]}"; do
    cd $directory
    if [ ! -d "node_modules" ]; then
      npm i
    fi
    npm link $plugin
    cd $LAUNCH_DIR
  done
done

cd $LAUNCH_DIR
