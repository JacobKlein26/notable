const router = require('express').Router()

router.get('/',(req,res)=>{
  return res.json({
    physicians:'/physicians',
    appointments:'physicians/{physician}/appointments'
  })
})
router.use('/physicians',require('./api/physicians.js'))
router.use('/appointments',require('./api/appointments.js'))

module.exports = router

