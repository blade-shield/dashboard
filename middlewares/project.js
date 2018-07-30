const Project = require('../models/Project')
const flash = require('express-flash')
const wrap = require('express-async-wrap')

exports.loadProject = wrap(async (req, res, next) => {
  try {
    const {
      user
    } = req

    const {
      _id: userId
    } = user

    const project = await Project.findById(req.params['projectId']).populate('issues')
    const isRelatedUser = project.users.indexOf(userId) > -1
    if (!project || !isRelatedUser) {
      flash('errors', {
        msg: 'Project Not found'
      })
      return res.redirect('/projects')
    }

    res.locals['project'] = project
    next()
  } catch (error) {
    console.log('error => ', error)
    flash('errors', {
      msg: 'Project Not found'
    })
    res.redirect('/')
  }
})
