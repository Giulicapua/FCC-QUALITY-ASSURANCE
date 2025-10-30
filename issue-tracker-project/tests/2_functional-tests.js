'use strict';
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let testId;
  const projectName = 'test-project-' + Date.now();

  suite('POST /api/issues/:project => create issue', function() {
    test('Create an issue with every field', function(done) {
      chai
        .request(server)
        .post(`/api/issues/${projectName}`)
        .send({
          issue_title: 'Bug en login',
          issue_text: 'No se puede iniciar sesión',
          created_by: 'Giuli',
          assigned_to: 'QA',
          status_text: 'Investigando'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Bug en login');
          assert.equal(res.body.issue_text, 'No se puede iniciar sesión');
          assert.equal(res.body.created_by, 'Giuli');
          assert.equal(res.body.assigned_to, 'QA');
          assert.equal(res.body.status_text, 'Investigando');
          assert.equal(res.body.open, true);
          assert.exists(res.body._id);
          assert.exists(res.body.created_on);
          assert.exists(res.body.updated_on);
          testId = res.body._id;
          done();
        });
    });

    test('Create an issue with only required fields', function(done) {
      chai
        .request(server)
        .post(`/api/issues/${projectName}`)
        .send({
          issue_title: 'Bug crítico',
          issue_text: 'Explota todo',
          created_by: 'Dev'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Bug crítico');
          assert.equal(res.body.issue_text, 'Explota todo');
          assert.equal(res.body.created_by, 'Dev');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.equal(res.body.open, true);
          done();
        });
    });

    test('Create an issue with missing required fields', function(done) {
      chai
        .request(server)
        .post(`/api/issues/${projectName}`)
        .send({
          issue_title: 'Falla',
          issue_text: ''
        })
        .end(function(err, res) {
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });

  suite('GET /api/issues/:project => view issues', function() {
    test('View issues for a project', function(done) {
      chai
        .request(server)
        .get(`/api/issues/${projectName}`)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length, 2);
          done();
        });
    });

    test('View issues with one filter', function(done) {
      chai
        .request(server)
        .get(`/api/issues/${projectName}`)
        .query({ created_by: 'Giuli' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].created_by, 'Giuli');
          done();
        });
    });

    test('View issues with multiple filters', function(done) {
      chai
        .request(server)
        .get(`/api/issues/${projectName}`)
        .query({ created_by: 'Giuli', open: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].created_by, 'Giuli');
          assert.equal(res.body[0].open, true);
          done();
        });
    });
  });

  suite('PUT /api/issues/:project => update issue', function() {
    test('Update one field on an issue', function(done) {
      chai
        .request(server)
        .put(`/api/issues/${projectName}`)
        .send({ _id: testId, issue_title: 'Título actualizado' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', '_id': testId });
          done();
        });
    });

    test('Update multiple fields on an issue', function(done) {
      chai
        .request(server)
        .put(`/api/issues/${projectName}`)
        .send({
          _id: testId,
          issue_text: 'Texto actualizado',
          status_text: 'Resuelto'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', '_id': testId });
          done();
        });
    });

    test('Update an issue with missing _id', function(done) {
      chai
        .request(server)
        .put(`/api/issues/${projectName}`)
        .send({ issue_title: 'Sin ID' })
        .end(function(err, res) {
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

    test('Update an issue with no fields to update', function(done) {
      chai
        .request(server)
        .put(`/api/issues/${projectName}`)
        .send({ _id: testId })
        .end(function(err, res) {
          assert.equal(res.body.error, 'no update field(s) sent');
          assert.equal(res.body._id, testId);
          done();
        });
    });

    test('Update an issue with invalid _id', function(done) {
      chai
        .request(server)
        .put(`/api/issues/${projectName}`)
        .send({ _id: '123invalidid', issue_text: 'Algo' })
        .end(function(err, res) {
          assert.equal(res.body.error, 'could not update');
          assert.equal(res.body._id, '123invalidid');
          done();
        });
    });
  });

  suite('DELETE /api/issues/:project => delete issue', function() {
    test('Delete an issue', function(done) {
      chai
        .request(server)
        .delete(`/api/issues/${projectName}`)
        .send({ _id: testId })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully deleted', '_id': testId });
          done();
        });
    });

    test('Delete an issue with invalid _id', function(done) {
      chai
        .request(server)
        .delete(`/api/issues/${projectName}`)
        .send({ _id: '123invalidid' })
        .end(function(err, res) {
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, '123invalidid');
          done();
        });
    });

    test('Delete an issue with missing _id', function(done) {
      chai
        .request(server)
        .delete(`/api/issues/${projectName}`)
        .send({})
        .end(function(err, res) {
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
