const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    postImage:{
        type:String,
        requied:true
    },
    title:{
        type:String,
        required:true
    },
    category : {
        type: String,
        required: true,
        enum:['Veg', 'Non-veg','Drinks', 'Desserts','Meals','Breakfast', 'Chinese','Snacks','Seafood','Fast-Food','Indian-Curries']
    },
    ingredients:{
        type:String,
        required:true
    },
    steps:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    profile : {
        type:String
    }
},
{
    timestamps:true
})

const Recipe = mongoose.model('Recipe',recipeSchema)

module.exports = Recipe