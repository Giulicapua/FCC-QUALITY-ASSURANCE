'use strict';

const {
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue
} = require('../controllers/issueController');

module.exports = function(app) {
  app.route('/api/issues/:project')
    .get(getIssues)
    .post(createIssue)
    .put(updateIssue)
    .delete(deleteIssue);
};
