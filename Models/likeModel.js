const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    postId:{
        type:String,
        required:true
    }
},
{timestamps:true}
)

const Likes = mongoose.model('Likes',likeSchema)

module.exports = Likes