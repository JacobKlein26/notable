const express = require('express')
const app = express()


app.use(express.json())
app.use(express.urlencoded())

app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*')
  res.header('Access-Control-Allow-Headers','*')
  res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS')
  next()
})

app.use('/',require('./routes/routes.js'))


const port = process.env.PORT||3001
app.listen(port,()=>{
  console.log('listening on ',port);
})