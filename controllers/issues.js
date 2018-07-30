const Project = require('../models/Project')
const Issue = require('../models/Issue')
const wrap = require('express-async-wrap')

exports.getIssueById = wrap(async (req, res) => {
  const project = await Project.findById(req.params['projectId'])

  res.render('projects/issues/show', {
    project
  })
})

exports.newIssue = wrap(async (req, res) => {
  const {
    project
  } = res.locals
  res.render('projects/issues/new', {
    project
  })
})

exports.createIssue = wrap(async (req, res) => {
  const {
    project
  } = res.locals
  console.log('res.locals => ', project)
  const {
    title,
    url,
    message,
    isResolved = false
  } = req.body

  const newIssue = await new Issue()
  newIssue.title = title
  newIssue.url = url
  newIssue.isResolved = isResolved
  newIssue.message = message
  newIssue.project = project._id

  const savedIssue = await newIssue.save()
  console.log('savedIssue => ', savedIssue)
  await Project.update({
    _id: project._id
  }, {
    $push: {
      issues: savedIssue._id
    }
  })

  res.redirect(`/projects/${req.params['projectId']}`)
})
