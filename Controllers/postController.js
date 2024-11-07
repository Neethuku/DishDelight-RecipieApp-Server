const Recipe = require("../Models/recipeModel")

exports.addRecipe = async (req,res) => {
    const {title,category,ingredients,steps,username,profile} =req.body
    const postImage = req.file.filename
    const {userId} = req.payload
    try {
        if(!postImage || !title || !category || !ingredients || !steps){
            res.status(400).json("Please fill all fields")
        }else{
            const newPost = new Recipe({
                postImage,title,category,ingredients,steps,userId,username,profile
            })
            await newPost.save()
            res.status(200).json(newPost)
        }
    } catch (err) {
        res.status(401).json(err)
    }
}


exports.editRecipe = async (req,res) => {
    const {postImage,title,category,ingredients,steps} =req.body
    const uploadImage = req.file?req.file.filename:postImage
    const {userId} = req.payload
    const {pid} = req.params
    try {
        if(!uploadImage || !title || !category || !ingredients || !steps){
            res.status(400).json("Please fill all fields")
        }else{
            const updateRecipe = await Recipe.findByIdAndUpdate({_id:pid, userId:userId},{postImage:uploadImage,title,category,ingredients,steps,userId},{new:true})
            await updateRecipe.save()
            res.status(200).json(updateRecipe)
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

exports.getAllRecipe = async (req, res) => {
    try {
        const { search } = req.query;  
        let allRecipe;

        if (search) {
            allRecipe = await Recipe.find({
                $or: [
                    { title: { $regex: search, $options: "i" } }, 
                    { category: search} 
                ]
            });
        } else {
            allRecipe = await Recipe.find(); 
        }

        res.status(200).json(allRecipe);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



exports.getRecentRecipe = async(req,res) => {
    try {
        const allRecipe = await Recipe.find().sort({createdAt:-1}).limit(4)
        res.status(200).json(allRecipe)
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.getHomeRecipe = async (req, res) => {
    try {
      const randomRecipes = await Recipe.aggregate([{ $sample: { size: 4 } }]);
      
      res.status(200).json(randomRecipes);
    } catch (error) {
      res.status(401).json(error);
    }
  };
  

exports.getUserRecipe = async(req,res) => {
   const {userId}=req.payload
   try {
    const userRecipe = await Recipe.find({userId})
     res.status(200).json(userRecipe)
   } catch (error) {
    res.status(401).json(error)
   }
}

exports.getUserRecipeByPid = async (req,res) => {
    const {pid} = req.params
    try {
        const userRecipe = await Recipe.find({_id:pid})
        res.status(200).json(userRecipe)
    } catch (error) {
        res.status(401).json(error)
    }
}


exports.deleteUserecipe = async (req, res) => {
    const { pid } = req.params; 
    const { userId, isAdmin } = req.payload; 

    try {
        const recipe = await Recipe.findById(pid);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        if (recipe.userId !== userId && !isAdmin) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        const deleteData = await Recipe.findByIdAndDelete(pid);
        return res.status(200).json({ message: "Recipe deleted successfully", deleteData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.getAllPosts = async (req, res) => {
    const { admin } = req.query;

    if (!admin) {
        return res.status(401).json({ message: "You are not allowed to see all posts" });
    }

    try {
        const { limit } = req.query;
        const postsLimit = limit ? parseInt(limit) : null; 

        let allPosts;

        if (postsLimit) {
            allPosts = await Recipe.find().sort({ createdAt: -1 }).limit(postsLimit);
        } else {
            allPosts = await Recipe.find().sort({ createdAt: -1 }); 
        }

        const totalPosts = await Recipe.countDocuments();
        res.status(200).json({ allPosts,totalPosts });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: "Server error" });
    }
};
