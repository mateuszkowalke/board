/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const threadController = require('../constrollers/thread_controller');
const replyController = require('../constrollers/reply_controller');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(threadController.threadPost)
    .get(threadController.threadGet)
    .delete(threadController.threadDelete)
    .put(threadController.threadPut);
    
  app.route('/api/replies/:board')
    .post(replyController.replyPost)
    .get(replyController.replyGet)
    .delete(replyController.replyDelete)
    .put(replyController.replyPut);

};
