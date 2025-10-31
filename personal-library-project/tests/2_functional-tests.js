/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

'use strict';
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testBookId;

  suite('POST /api/books with title => create book object/expect book object', function() {
    
    test('Test POST /api/books with title', function(done) {
      chai.request(server)
        .post('/api/books')
        .send({ title: 'Cien Años de Soledad' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, '_id');
          assert.property(res.body, 'title');
          assert.equal(res.body.title, 'Cien Años de Soledad');
          testBookId = res.body._id;
          done();
        });
    });
    
    test('Test POST /api/books with no title given', function(done) {
      chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title');
          done();
        });
    });
  });

  suite('GET /api/books => array of books', function(){
    
    test('Test GET /api/books', function(done){
      chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          if (res.body.length > 0) {
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'commentcount');
          }
          done();
        });
    });
  });

  suite('GET /api/books/[id] => book object with [id]', function(){
    
    test('Test GET /api/books/[id] with id not in db', function(done){
      chai.request(server)
        .get('/api/books/507f1f77bcf86cd799439011')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
    });
    
    test('Test GET /api/books/[id] with valid id in db', function(done){
      chai.request(server)
        .get(`/api/books/${testBookId}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, '_id');
          assert.property(res.body, 'title');
          assert.property(res.body, 'comments');
          assert.isArray(res.body.comments);
          done();
        });
    });
  });

  suite('POST /api/books/[id] => add comment/expect book object with id', function(){
    
    test('Test POST /api/books/[id] with comment', function(done){
      chai.request(server)
        .post(`/api/books/${testBookId}`)
        .send({ comment: 'Una obra maestra del realismo mágico latinoamericano' })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, '_id');
          assert.property(res.body, 'title');
          assert.property(res.body, 'comments');
          assert.isArray(res.body.comments);
          assert.include(res.body.comments, 'Una obra maestra del realismo mágico latinoamericano');
          done();
        });
    });

    test('Test POST /api/books/[id] without comment field', function(done){
      chai.request(server)
        .post(`/api/books/${testBookId}`)
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        });
    });

    test('Test POST /api/books/[id] with comment, id not in db', function(done){
      chai.request(server)
        .post('/api/books/123456789012345678901234')
        .send({ comment: 'Este libro no existe en la base de datos' })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
    });
  });

  suite('DELETE /api/books/[id] => delete book object id', function() {

    test('Test DELETE /api/books/[id] with valid id in db', function(done){
      chai.request(server)
        .post('/api/books')
        .send({ title: 'El Alquimista' })
        .end(function(err, res) {
          const bookToDelete = res.body._id;
          chai.request(server)
            .delete(`/api/books/${bookToDelete}`)
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, 'delete successful');
              done();
            });
        });
    });

    test('Test DELETE /api/books/[id] with id not in db', function(done){
      chai.request(server)
        .delete('/api/books/abcdef123456789012345678')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
    });
  });

  suite('DELETE /api/books => delete all books', function() {
    
    test('Test DELETE /api/books to delete all books', function(done){
      chai.request(server)
        .delete('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'complete delete successful');
          done();
        });
    });
  });
});
