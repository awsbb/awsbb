'use strict';

exports.myHandler = function (event, context) {
  console.log('Event:', event);
  console.log('Context:', context);
  context.succeed([{
    title: 'One',
    message: 'This is a reply.'
  }, {
    title: 'Two',
    message: 'This is another reply.'
  }]);
};
