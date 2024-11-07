const mongoose = require('mongoose')
const users = require("../Models/userModel")

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    postId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        ref:users,
        required:true
    },
    likedUsers:{
        type:Array,
        default:[]
    },
    numberOflikes:{
        type:Number,
        default:0
    },
    username:{
        type:String,
        required:true
    },
    profile : {
        type:String
    }
},
{timestamps:true}
)

const Comment = mongoose.model('Comment',commentSchema);

module.exports =  Comment;