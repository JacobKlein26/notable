const router = require('express').Router()
const db = require('../../modules/db.js')

// add physician
router.post('/',async(req,res)=>{
  const data = req.body
  if(!data || !data.name || !data.email) return res.sendStatus(400)
  const result = await db.insert('physicians',data, {createID:true})
  return res.json(result)
})
// get physicians
router.get('/',async(req,res)=>{
  const data = await db.get('physicians',{})
  return res.json(data)
})
// get 1 physician
router.get('/:id',async(req,res)=>{
  const id = parseInt(req.params.id)||null
  const data = await db.get('physicians',{id:id})
  return res.json(data)
})



module.exports = router

