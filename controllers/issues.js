const Project = require('../models/Project')
const Issue = require('../models/Issue')
const Event = require('../models/Event')
const wrap = require('express-async-wrap')

exports.getIssueById = wrap(async (req, res) => {
  const {
    project
  } = res.locals
  const issue = await Issue
    .findById(req.params['issueId'])
    .populate('events', '_id', null, {
      sort: {
        'created_at': -1
      }
    })
  let event = {}
  if (issue.events.length > 0) {
    event = await Event.findById(issue.events[0])
  }

  res.render('projects/issues/show', {
    project,
    issue,
    event
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
    source,
    message,
    isResolved = false
  } = req.body

  const newIssue = await new Issue()
  newIssue.title = title
  newIssue.source = source
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
