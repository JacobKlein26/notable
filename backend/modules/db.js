const MongoClient = require('mongodb').MongoClient


let dbConnection, db;
const collectionNames = [
  'physicians',
  'appointments'
]
const collections={
  
}

function connectDB() {
  if(dbConnection) return dbConnection
  dbConnection = new Promise((res, rej) => {
    const MONGO_DB_PROTOCOL = process.env.MONGO_DB_PROTOCOL || 'mongodb'
    const MONGO_DB_DOMAIN = process.env.MONGO_DB_DOMAIN || 'localhost'
    const MONGO_DB_PORT = process.env.MONGO_DB_PORT || 27017
    const MONGO_DB_PATH = `${MONGO_DB_PROTOCOL}://${MONGO_DB_DOMAIN}:${MONGO_DB_PORT}`
    MongoClient.connect(MONGO_DB_PATH,(err,client)=>{
      if(err){
        console.error('failed to connect to DB, ',err);
        return rej(err)
      }
      console.log('connected to DB');
      const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'notable'
      db = client.db(MONGO_DB_NAME)
      collectionNames.forEach(cat => {
        collections[cat] = db.collection(cat)
      });
      return res()
    })
  })
  return dbConnection
}
function getID(collection) {
  return new Promise((res,rej) => {
    if(!collection || !collections[collection]) return rej('undefined collection')
    collections[collection].find().sort({id:-1}).limit(1).project({_id:0,id:1}).toArray((err,docs)=>{
      if(err){
        console.error('error getting id for collection '+collection+', ',err);
        return rej(err)
      }
      if(!docs || !docs[0]) return res(1)
      return res(docs[0].id + 1)
    })
  })
  
}
function insert(collection, data, options={}) {
  return new Promise(async(res,rej)=>{
    let {
      createID = false
    } = options
    await connectDB()
    if(!collection || !collections[collection]) return rej('undefined collection')
    if(!data) return rej('undefined data')
    if(createID) data.id = await getID(collection)

    const result = await collections[collection].insertOne({...data})
    return res(data)
  })
}
function update(collection, query, data, options={}) {
  let {
    updateMethod = '$set',
    updateCmd = 'updateMany'
  } = options
  return new Promise(async(res,rej)=>{
    await connectDB()
    if(!collection || !collections[collection]) return rej('undefined collection')
    if(!query) return rej('undefined query')
    if(!data) return rej('undefined data')
    const result = await collections[collection][updateCmd](query,{[updateMethod]:{...data}}).catch(e=>{
      console.log('failed to update, ',e)
    })
    return res(result)
  })
}
function updateOne(collection, query, data, options={}){
  options = {...options, updateCmd:'updateOne'}
  return update(collection, query, data, options)
}

function get(collection, query, options={}) {
  return new Promise(async(res,rej)=>{
    let {
      
    } = options
    await connectDB()
    if(!collection || !collections[collection]) return rej('undefined collection')
    if(!query) return rej('undefined query')

    collections[collection].find(query).toArray((err,docs)=>{
      if(err){
        console.error('error when querying '+collection+'with query '+JSON.stringify(query)+', ',err);
        return rej(err)
      }
      docs.map(d=>delete d._id)
      return res(docs)
    })
  })
}
function getOne(collection, query, options={}) {
  return new Promise(async(res,rej)=>{
    let {
      
    } = options
    await connectDB()
    get(collection, query, options)
    .then(result=>{
      if(!result.length) return res({})
      return res(result[0])
      
    })
    .catch(e=>{
      return rej(e)
    })
  })
}
function deleteOne(collection, query, options={}) {
  return new Promise(async (res,rej)=>{
    let {} = options
    await connectDB()
    if(!collection || !collections[collection]) return rej('collection undefined')
    if(!query) return rej('query undefined')
    const result = await collections[collection].deleteOne(query)
    return res(result)

  })
  
}


module.exports = {
  insert,
  get,
  getOne,
  update,
  updateOne,
  deleteOne
}