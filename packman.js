'use strict';

// using this to generate the readme packages list

var pkg = require('./package.json');
var path = require('path');
var format = require('string-format');;

console.log(Object.keys(pkg.devDependencies).map(function (name) {
  var subPackage = require(path.join(__dirname, 'node_modules', name, 'package.json'));
  if (subPackage.homepage) {
    return format('* [{}]({})', name, subPackage.homepage);
  }
  return format('* {}', name);
}).join('\n'));
