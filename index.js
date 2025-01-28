require('dotenv').config()
const express= require('express')
const cors = require('cors')
require('./DB/Connection')
const router = require('./Routes/Routes')
const path = require('path');
 
const BlogServer = express()
BlogServer.use(cors())
BlogServer.use(express.json())
BlogServer.use(router)
// BlogServer.use('/uploads',express.static(path.join(__dirname,'./uploads')))
BlogServer.use('/uploads',express.static('./uploads'))


const PORT = 4000
BlogServer.listen(PORT,()=>{
    console.log(`Server started at port : ${PORT}`);
    
})

BlogServer.get('/',(req,res)=>{
    res.status(200).send("<h1 style=color:red;>Blog server started !!! waiting for client Request....</h1>")
})