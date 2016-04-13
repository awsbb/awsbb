#!/bin/sh

LAUNCH_DIR=${PWD}

if [ ! -d node_modules ]; then
  npm i
fi

customNPMModules=(./server/aws/npm/@awsbb/*);
lambdaFunctions=(./server/aws/lambda/*);

for directory in "${customNPMModules[@]}"; do
  IFS='@' read -r -a array <<< "$directory"
  plugin="@${array[1]}"
  cd $directory
  npm link --production
  cd $LAUNCH_DIR
  for directory in "${lambdaFunctions[@]}"; do
    cd $directory
    npm link $plugin --production
    cd $LAUNCH_DIR
  done
done

cd $LAUNCH_DIR
