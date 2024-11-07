const mongoose = require('mongoose')
const ConnectionString = process.env.ConnectionString

mongoose.connect(ConnectionString).then(()=>{
    console.log('MongoDB Atlas connected with BlogServer');
    
}).catch((err)=>{
    console.log('MongoDB connection failed',err);
    
})