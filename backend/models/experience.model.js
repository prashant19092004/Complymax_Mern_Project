const mongoose = require("mongoose")

const experienceSchema = new mongoose.Schema({
    company : {
        type: String,
        required : true
    },
    role :{
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
    location : {
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

module.exports = mongoose.model("Experience", experienceSchema);