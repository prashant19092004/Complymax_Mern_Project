const mongoose = require("mongoose")

const educationSchema = new mongoose.Schema({
    institute: {
        type: String,
        required : true
    },
    degree:{
        type: String,
        required : true
    },
    starting_month: {
        type: String,
        required: true
    },
    starting_year: {
        type: String,
        required: true
    },
    
    ending_month: {
        type: String,
        required: true
    },
    ending_year: {
        type: String,
        required: true
    },
    score : {
        type : String,
        required : true
    },
    description: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
})

module.exports = mongoose.model("Education", educationSchema);