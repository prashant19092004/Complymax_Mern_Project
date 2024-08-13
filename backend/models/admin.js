const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim:true
    },
    contact: {
        type: Number
    },
    role: {
        type: String
    },
    clients: {
        type: [mongoose.Schema.Types.ObjectId],
        ref : "Client"
    },
    supervisors : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Supervisor"
    },
    users : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "User"
    }

 })

 module.exports = mongoose.model("Admin",adminSchema)