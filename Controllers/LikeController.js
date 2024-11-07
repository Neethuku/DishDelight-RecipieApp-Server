const Likes = require('../Models/likeModel')

exports.toggleLike = async (req, res) => {
    const { pId } = req.params;
    const  {userId}  = req.payload; 


    try {
        const existingLike = await Likes.findOne({ postId: pId, userId });

        if (existingLike) {
            await Likes.deleteOne({ _id: existingLike._id });
            return res.status(200).json({ message: 'Like removed' });
        } else {
            const newLike = new Likes({ postId: pId, userId });
            await newLike.save();
            return res.status(201).json({ message: 'Like added' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.getLikes = async(req,res) => {
    const {pId} = req.params;
    const {userId} = req.payload

    try {
        const userLiked = await Likes.findOne({postId:pId, userId})
        const isLiked = !!userLiked
        const totalLikes = await Likes.countDocuments({postId:pId})
        return res.status(200).json({
            isLiked,
            totalLikes
        })
    } catch (error) {
        console.log(error);
        
    }
}