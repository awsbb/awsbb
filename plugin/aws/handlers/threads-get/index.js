'use strict';

exports.myHandler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);
  context.succeed([{
    title: 'One',
    description: 'This is a thread.'
  }, {
    title: 'Two',
    description: 'This is another thread.'
  }]);
};
