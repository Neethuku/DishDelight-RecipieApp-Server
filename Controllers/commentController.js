const Comment  = require("../Models/commentModel");

exports.createComment = async(req,res) => {
    const {content,username,profile} = req.body;
    const {userId} = req.payload;
    const {pId} = req.params;
    const postId = pId;
    try {
        if(!userId || !pId || !content){
            res.status(403).json('You are not allowed to create this comment')
        }else{
            const newComment = new Comment({
                content,postId,userId,likedUsers:[],numberOflikes:0,username,profile
            })
            await newComment.save()
            res.status(200).json({message:"Comment added successfully"})
        }
    } catch (error) {
        console.log(error);
        
    }
}

exports.getPostComments = async(req,res) => {
    const {pId} = req.params;
    try {
        const postComment = await Comment.find({postId:pId}) .populate('userId', 'username') 
        if(postComment.length === 0){
            res.status(401).json({message:"No comments found"})
        }else{
            res.status(200).json(postComment)
        }
        
    } catch (error) {
        console.log(error);
        
    }
}


exports.deleteComment = async(req,res) => {
    const {commentId} = req.body;
    const {userId, isAdmin} = req.payload;
   
    try {
        const comment = await Comment.findById(commentId)
        if(!comment){
            return res.status(404).json({ message: "comment not found" });
        }
        if(comment.userId !== userId && !isAdmin){
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }
        const deleteComment = await Comment.findByIdAndDelete(commentId)
        res.status(200).json(deleteComment)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


exports.editComment = async (req,res) => {
    const {commentId,content} = req.body;
    try {
        if(commentId && content){
            const updatedcomment = await Comment.findByIdAndUpdate({_id:commentId},{content})
            await updatedcomment.save()
            res.status(200).json(updatedcomment)
        }
    } catch (error) {
        res.status(401).json(err)
    }
}


exports.likeComment = async(req,res) => {
    const {commentId} = req.body
    const {userId} = req.payload

    try {
        const existingComment = await Comment.findById({_id:commentId}) 
        if(!existingComment){
            return res.status(404).json({ message: "Comment not found" });
        }

        const isLiked = existingComment.likedUsers.includes(userId)
        if(isLiked){
            existingComment.likedUsers = existingComment.likedUsers.filter((id) => id !==userId)
            existingComment.numberOflikes -=1;
            await existingComment.save()
            return res.status(200).json({message:"Comment unliked",numberOflikes:existingComment.numberOflikes})
        }else{
            existingComment.likedUsers.push(userId);
            existingComment.numberOflikes +=1;
            await existingComment.save()
            return res.status(200).json({message:"Comment liked",numberOflikes:existingComment.numberOflikes})
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}



exports.getAllComments = async (req, res) => {
    const { admin } = req.query;

    if (!admin) {
        return res.status(401).json({ message: "You are not allowed to see all posts" });
    }

    try {
        const { limit } = req.query;
        const commentLimit = limit ? parseInt(limit) : null; 

        let allComments;
        if (commentLimit) {
            allComments = await Comment.find().sort({ createdAt: -1 }).limit(commentLimit);
        } else {
            allComments = await Comment.find().sort({ createdAt: -1 }); 
        }

       
        const totalComments = await Comment.countDocuments();
        res.status(200).json({ allComments,totalComments });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: "Server error" });
    }
};
