const router = require('express').Router()


router.use('/api',require('./api.js'))
router.use('/',require('./api.js'))

module.exports = router

