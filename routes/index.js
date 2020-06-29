const router = require('express').Router()

router.use('/api', require('./bookRoutes.js'))
router.use('/api', require('./googleRoutes.js'))

module.exports = router