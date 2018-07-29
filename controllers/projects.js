const Project = require('../models/Project')
const projectTypes = require('../config/project-types')
/**
 * GET /projects
 */
exports.getProjects = (req, res) => {
  console.log(req.user)

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
exports.getProjectById = (req, res) => {
  res.render('projects/show', {
    title: 'Project'
  })
}

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
exports.createProject = (req, res) => {
  console.log('NEW PROJECT')

  console.log(req.body)
  req.flash('success', {
    msg: 'Project has been created successfully!'
  })
  res.redirect('/projects')
}

/**
 * GET /projects/:id/edit
 */
exports.editProject = (req, res) => {
  res.render('projects/:id/edit', {
    title: 'Project: Edit'
  })
}

/**
 * PUT /projects/:id/edit
 */
exports.updateProject = (req, res) => {
  console.log('NEW PROJECT')

  console.log(req.body)
  req.flash('success', {
    msg: 'Project has been created successfully!'
  })
  res.redirect('/projects')
}
