const router = require('express').Router()
const db = require('../../modules/db.js')

// add appointments
router.post('/',async(req,res)=>{
  const data = req.body
  // new Date().toLocaleString() - to use later for time storing 
  data.time = new Date(data.time).toLocaleString()
  if(!data || !data.name || !data.time || !data.kind) return res.sendStatus(400)
  const result = await db.insert('appointments',data, {createID:true})
  return res.json(result)
})
// get appointments
router.get('/',async(req,res)=>{
  const data = await db.get('appointments',{})
  return res.json(data)
})
// get 1 appointments
router.get('/:id',async(req,res)=>{
  const id = parseInt(req.params.id)||null
  const data = await db.get('appointments',{id:id})
  return res.json(data)
})



module.exports = router

