const wrap = require('express-async-wrap')
const uaParser = require('ua-parser-js')

const Project = require('../models/Project')
const Issue = require('../models/Issue')
const Event = require('../models/Event')

exports.create = wrap(async (req, res) => {
  const useragent = uaParser(req.headers['user-agent'])

  // Find the project
  const project = await Project.findById(req.params['projectId'])

  const {
    title,
    message,
    source,
    lineno,
    colno,
    stack
  } = req.body

  // Find the same issue
  const existsIssue = await Issue.findOne({
    title,
    message,
    source
  })
  let returnIssue = existsIssue

  if (returnIssue === null) { // Need to create Issue
    const newIssue = new Issue({
      title,
      message,
      source,
      project: project._id
    })

    returnIssue = await newIssue.save()

    await Project.update({
      _id: project._id
    }, {
      $push: {
        issues: returnIssue._id
      }
    })
  }
  // Create Event

  const savedEvent = await (new Event({
    title,
    message,
    source,
    lineno,
    colno,
    stack,
    useragent,
    url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    issue: returnIssue._id
  })).save()

  await Issue.update({
    _id: returnIssue._id
  }, {
    $push: {
      events: savedEvent._id
    }
  })

  res.json({
    project,
    issue: returnIssue,
    event: savedEvent
  })
})
