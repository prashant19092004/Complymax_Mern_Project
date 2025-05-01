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
        default: ""
    },
    ending_year: {
        type: String,
        default: ""
    },
    location : {
        type : String,
        required : true
    },
    description: {
        type: String,
        default: ""
    },
    certificate: {
        type: String,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
})

module.exports = mongoose.model("Experience", experienceSchema);