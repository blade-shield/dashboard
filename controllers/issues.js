const Project = require('../models/Project')
const User = require('../models/User')
const wrap = require('express-async-wrap')

exports.getIssueById = wrap(async (req, res) => {
  const project = await Project.findById(req.params['projectId'])

  res.render('projects/issues/show', {
    project
  })
})

exports.newIssue = wrap(async (req, res) => {
  const project = await Project.findById(req.params['projectId'])

  res.render('projects/issues/new', {
    project
  })
})

exports.createIssue = wrap(async (req, res) => {
  console.log('createIssue')
  res.redirect(`/projects/${req.params['projectId']}`)
})
