'use strict';
require('../db/connection'); 
const Issue = require('../models/Issue');

exports.getIssues = async (req, res) => {
  try {
    const project = req.params.project;
    const filters = { project };
    
    Object.keys(req.query).forEach(key => {
      if (req.query[key] !== '') {
        if (key === 'open') {
          filters[key] = req.query[key] === 'true';
        } else {
          filters[key] = req.query[key];
        }
      }
    });

    const issues = await Issue.find(filters);
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching issues' });
  }
};

exports.createIssue = async (req, res) => {
  try {
    const project = req.params.project;
    const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

    if (!issue_title || !issue_text || !created_by) {
      return res.json({ error: 'required field(s) missing' });
    }

    const newIssue = new Issue({
      project,
      issue_title,
      issue_text,
      created_by,
      assigned_to: assigned_to || '',
      status_text: status_text || ''
    });

    const savedIssue = await newIssue.save();
    res.json(savedIssue);
  } catch (error) {
    res.status(500).json({ error: 'Error creating issue' });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.json({ error: 'missing _id' });
    }

    const updateData = {};
    const validFields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];
    
    let hasUpdates = false;
    validFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
        hasUpdates = true;
      }
    });

    if (!hasUpdates) {
      return res.json({ error: 'no update field(s) sent', '_id': _id });
    }

    updateData.updated_on = new Date();

    const updatedIssue = await Issue.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedIssue) {
      return res.json({ error: 'could not update', '_id': _id });
    }

    res.json({ result: 'successfully updated', '_id': _id });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.json({ error: 'could not update', '_id': req.body._id });
    }
    res.status(500).json({ error: 'Error updating issue' });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.json({ error: 'missing _id' });
    }

    const deletedIssue = await Issue.findByIdAndDelete(_id);

    if (!deletedIssue) {
      return res.json({ error: 'could not delete', '_id': _id });
    }

    res.json({ result: 'successfully deleted', '_id': _id });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.json({ error: 'could not delete', '_id': req.body._id });
    }
    res.status(500).json({ error: 'Error deleting issue' });
  }
};