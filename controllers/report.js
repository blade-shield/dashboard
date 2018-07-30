const wrap = require('express-async-wrap')

exports.create = wrap(async (req, res) => {
  res.json({})
})
