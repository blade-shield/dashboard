const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  message: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: ''
  },
  lineno: {
    type: Number,
    default: -1
  },
  colno: {
    type: Number,
    default: -1
  },
  stack: {
    type: String,
    default: ''
  },
  useragent: {
    type: Object,
    default: {}
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  },
  url: {
    type: String,
    default: ''
  }
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
