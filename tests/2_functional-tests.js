/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const Thread = require('../models/thread');
const Reply = require('../models/reply');
const Board = require('../models/board');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {

      test('POST a thread', function(done) {
        chai.request(server)
        .post('/api/threads/test/')
        .send({
          text: 'test thread',
          delete_password: 'test thread'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          Thread.findOne({text: 'test thread'}, (err, thread) => {
            if (err) console.log(err);
            assert.equal(thread.text, 'test thread');
            assert.equal(thread.delete_password, 'test thread');
            assert.property(thread, 'created_on');
            assert.property(thread, 'bumped_on');
            assert.property(thread, 'reported');
            assert.property(thread, '_id');
            done();
          });
        });
      });

    });
    
    suite('GET', function() {
      
      test('GET a thread', function(done) {
        chai.request(server)
        .get('/api/threads/test/')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isAtMost(res.body.length, 10);
          for (thread of res.body) {
            assert.isAtMost(thread.replies.length, 3);
          }
          done();
        });
      });

    });
    
    suite('DELETE', function() {
      
      test('DELETE a thread', function(done) {
        Board.findOne({name: 'test'})
        .populate('threads')
        .exec((err, board) => {
          chai.request(server)
          .delete('/api/threads/test/')
          .send({
            thread_id: board.threads[0]._id,
            delete_password: 'test thread'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            Thread.findOne({_id: board.threads[0]._id}, (err, thread) => {
              if (err) console.log(err);
              assert.equal(thread, null);
              done();
            });
          });
        });        
      });

    });
    
    suite('PUT', function() {
      
      test('PUT a thread', function(done) {
        Board.findOne({name: 'test'})
        .populate('threads')
        .exec((err, board) => {
          chai.request(server)
          .put('/api/threads/test/')
          .send({report_id: board.threads[0]._id})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            Thread.findOne({_id: board.threads[0]._id}, (err, thread) => {
              if (err) console.log(err);
              assert.equal(thread.reported, true);
              done();
            });
          });
        });        
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('POST a reply', function(done) {
        Board.findOne({name: 'test'})
        .populate('threads')
        .exec((err, board) => {
          if (err) console.log(err);
          chai.request(server)
          .post('/api/replies/test/')
          .send({
            text: 'test reply',
            delete_password: 'test reply',
            thread_id: board.threads[0]._id
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            Thread.findOne({_id: board.threads[0]._id})
            .populate('replies')
            .exec((err, thread) => {
              if (err) console.log(err);
              assert.equal(thread.replies[0].text, 'test reply');
              assert.equal(thread.replies[0].delete_password, 'test reply');
              assert.property(thread.replies[0], 'created_on');
              assert.property(thread.replies[0], 'reported');
              assert.property(thread.replies[0], '_id');
              done();
            });
          });
        });
      });

    });
    
    suite('GET', function() {
      test('GET replies', function(done) {
        chai.request(server)
        .get('/api/threads/test/')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isAtMost(res.body.length, 10);
          for (thread of res.body) {
            assert.isAtMost(thread.replies.length, 3);
          }
          done();
        });
      });
    });
    
    suite('PUT', function() {

      test('PUT reply', function(done) {
        Board.findOne({name: 'test'})
        .populate('threads')
        .exec((err, board) => {
          if (err) console.log(err);
          Thread.findOne({_id: board.threads[0]._id})
          .populate('replies')
          .exec((err, thread) => {
            if (err) console.log(err);
            chai.request(server)
            .put('/api/replies/test/')
            .send({
              thread_id: thread._id,
              reply_id: thread.replies[0]._id
            })
            .end(function(err, res) {
              if (err) console.log(err);
              assert.equal(res.status, 200);
              Reply.findOne({_id: thread.replies[0]._id}, (err, reply) => {
                if (err) console.log(err);
                assert.equal(reply.reported, true);
                done();
              });
            });
          });
        });
      });
    });
    
    suite('DELETE', function() {

      test('DELETE reply', function(done) {
        Board.findOne({name: 'test'})
        .populate('threads')
        .exec((err, board) => {
          if (err) console.log(err);
          Thread.findOne({_id: board.threads[0]._id})
          .populate('replies')
          .exec((err, thread) => {
            if (err) console.log(err);
            chai.request(server)
            .delete('/api/replies/test/')
            .send({
              thread_id: thread._id,
              reply_id: thread.replies[0]._id,
              delete_password: 'test reply'
            })
            .end(function(err, res) {
              if (err) console.log(err);
              assert.equal(res.status, 200);
              Reply.findOne({_id: thread.replies[0]._id}, (err, reply) => {
                if (err) console.log(err);
                assert.equal(reply.text, '[deleted]');
                done();
              });
            });
          });
        });
      });
    });

  });

});
