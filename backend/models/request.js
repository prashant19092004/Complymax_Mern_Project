const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    date: {
        type: Date,
        required : true
    },
    status:{
        type: String,
        enum:["Pending","Approved","Reject"],
        default: "Pending"
    },
    purpose: {
        type: String,
        required: true
    },
    pass_type: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    response_from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
})

module.exports = mongoose.model("Request", requestSchema);