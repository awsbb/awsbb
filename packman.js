'use strict';

// using this to generate the readme packages list

const pkg = require('./package.json');
const path = require('path');

console.log(Object.keys(pkg.dependencies).map((name) => {
  const subPackage = require(path.join(__dirname, 'node_modules', name, 'package.json'));
  if (subPackage.homepage) {
    return `- [${name}](${subPackage.homepage})`;
  }
  return `- ${name}`;
}).join('\n'));
