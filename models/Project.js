const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  issues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  }],
  // Integrate with external services
  slack: {
    url: String,
    channel: String,
    username: String,
    isEnabled: {
      type: Boolean,
      default: false
    }
  }
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
