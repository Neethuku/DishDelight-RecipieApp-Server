const users = require('../Models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Recipe = require('../Models/recipeModel')
const Comment = require('../Models/commentModel')
const Likes = require('../Models/likeModel')
const { json } = require('express')

exports.register = async (req,res) => {
    const {username,email,password } = req.body
    try {
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(400).json("User already exists! Please login")
        }else{
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
            const newUser = new users({
                username,email,password:hashedPassword
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

exports.signIn = async (req,res) => {
    const {email,password} = req.body
    try {
        const existingUser = await users.findOne({email})
        if(!existingUser){
           return res.status(406).json("User not found!!! Please Sign Up")
        }
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)
        if(!isPasswordCorrect){
            return res.status(406).json("Invalid email / password")
        }
        const token = jwt.sign({userId:existingUser._id,isAdmin: existingUser.isAdmin},process.env.jwt_secretkey)
        const userDetails = {
            _id:existingUser._id,
            email:existingUser.email,
            username:existingUser.username,
            profile:existingUser.profile,
            isAdmin:existingUser.isAdmin
        }
        return res.status(200).json({userDetails,token})
    } catch (err) {
        return res.status(401).json(err)
    }
}

exports.googleLogin = async(req,res) => {
    const {username,email,profile} = req.body;
    try {
        const existingUser = await users.findOne({email})
        if(existingUser){
            const token = jwt.sign({userId:existingUser._id,isAdmin: existingUser.isAdmin},process.env.jwt_secretkey)
        const userDetails = {
            _id:existingUser._id,
            email:existingUser.email,
            username:existingUser.username,
            profile:existingUser.profile,
            isAdmin:existingUser.isAdmin
        }
        return res.status(200).json({userDetails,token})
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
         const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new users({
                username,email,password:hashedPassword,profile
            })
            await newUser.save()
            const token = jwt.sign({userId:newUser._id,isAdmin: newUser.isAdmin},process.env.jwt_secretkey)
            const userDetails = {
                _id:newUser._id,
                email:newUser.email,
                username:newUser.username,
                profile:newUser.profile,
                isAdmin:newUser.isAdmin
            }
            res.status(200).json({userDetails,token}) 
        }
    } catch (error) {
        console.log(error);
        
    }
}

exports.deleteAccount = async(req,res) => {
    const {userId} = req.body;
    const {isAdmin} = req.payload
    if(!userId){
        return res.status(400).json({message:"user id required"})
    }
    try {
        if (!isAdmin ) {
            return res.status(403).json({ message: "Unauthorized. You can only delete your own account." });
        }

        const deleteUser = await users.findByIdAndDelete({_id:userId})
        if(!deleteUser){
            return res.status(404).json({message:"User not found"})
        }
        await Recipe.deleteMany({userId})
        await Comment.deleteMany({userId})
        await Likes.deleteMany({userId})
        res.status(200).json({message:"Account deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"deleting account failed",error})
    }
}




exports.editUserProfile = async (req, res) => {
    const { userId } = req.payload;
    const { profile, username, email, password } = req.body;
    const profileImage = req.file ? req.file.filename : profile;

    try {
        if (!username || !email) {
            return res.status(400).json("Please fill all fields");
        }

        const existingUser = await users.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingEmail = await users.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== userId.toString()) {
            return res.status(400).json({ message: "Email already exists..Try another.." });
        }

        let hashedPassword = existingUser.password;
        if (password && password.trim()) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const updateUser = await users.findByIdAndUpdate(
            userId,
            {
                username,
                email,
                password: hashedPassword,
                profile: profileImage,
            },
            { new: true }
        );

        await updateUser.save();

        await Recipe.updateMany(
            { userId },
            { username, profile: profileImage }
        );

        const userDetails = {
            _id: updateUser._id,
            email: updateUser.email,
            username: updateUser.username,
            profile: updateUser.profile,
            isAdmin: updateUser.isAdmin,
        };

        return res.status(200).json({ userDetails });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.getAllUsers = async (req, res) => {
    const { admin } = req.query;

    if (!admin) {
        return res.status(401).json({ message: "You are not allowed to see all users" });
    }

    try {
        const { limit } = req.query;
        const usersLimit = limit ? parseInt(limit) : null; 

        let allUsers;

        if (usersLimit) {
            allUsers = await users.find().sort({ createdAt: -1 }).limit(usersLimit);
        } else {
            allUsers = await users.find().sort({ createdAt: -1 }); 
        }

        const totalUsers = await users.countDocuments();
        res.status(200).json({ allUsers,totalUsers });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: "Server error" });
    }
};

