const Project = require('../models/Project')
const User = require('../models/User')
const projectTypes = require('../config/project-types')
const wrap = require('express-async-wrap')

/**
 * GET /projects
 */
exports.getProjects = (req, res) => {
  Project.find({
    users: req.user._id
  })
    .then((projects) => {
      const attributes = {
        title: 'Projects',
        projects
      }
      res.render('projects/index', attributes)
    })
}

/**
 * GET /projects/:id
 */
exports.getProjectById = wrap(async (req, res) => {
  try {
    const project = await Project.findById(req.params['id'])

    res.render('projects/show', {
      title: 'Project',
      project
    })
  } catch (error) {
    req.flash('errors', {
      msg: 'Project not found'
    })
    res.redirect('/projects')
  }
})

/**
 * GET /projects/:id/dashboard
 */
exports.getOverview = wrap(async (req, res) => {
  try {
    const project = await Project.findById(req.params['id'])

    res.render('projects/dashboard', {
      title: 'Project',
      project
    })
  } catch (error) {
    req.flash('errors', {
      msg: 'Project not found'
    })
    res.redirect('/projects')
  }
})

/**
 * GET /projects/new
 */
exports.newProject = (req, res) => {
  res.render('projects/new', {
    title: 'Project: New',
    types: projectTypes
  })
}

/**
 * POST /projects/new
 */
exports.createProject = wrap(async (req, res) => {
  const {
    _id: userId
  } = req.user
  const {
    name,
    type
  } = req.body

  const newProject = new Project()
  newProject.name = name
  newProject.type = type
  newProject.owner = userId
  newProject.users.push(userId)

  const savedProject = await newProject.save()

  await User.update({
    _id: userId
  }, {
    $push: {
      projects: savedProject._id
    }
  })

  req.flash('success', {
    msg: 'Project has been created successfully!'
  })
  res.redirect('/projects')
})

/**
 * GET /projects/:id/edit
 */
exports.editProject = wrap(async (req, res) => {
  try {
    const project = await Project.findById(req.params['id']).populate('owner').populate('users')
    res.render('projects/edit', {
      title: 'Project: Edit',
      types: projectTypes,
      project
    })
  } catch (error) {
    req.flash('errors', {
      msg: 'Project not found'
    })
    res.redirect('/projects')
  }
})
/**
 * PUT /projects/:id
 */
exports.updateProject = wrap(async (req, res) => {
  try {
    const project = await Project.findById(req.params['id'])
    const {
      name,
      type,
      slack
    } = req.body
    project.name = name
    project.type = type
    // Parse Slack
    const parsedSlack = {
      isEnabled: slack.isEnabled === 'on',
      url: slack.url || '',
      webhook: slack.webhook || '',
      channel: slack.channel || ''
    }

    project.slack = parsedSlack

    await project.save()

    req.flash('success', {
      msg: 'Project has been updated successfully!'
    })
    res.redirect('/projects')
  } catch (error) {
    console.log(error)
    req.flash('errors', {
      msg: 'Project not found'
    })
    res.redirect('/projects')
  }
})
