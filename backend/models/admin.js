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
        type: String,
        default: ''
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
    },
    hirings : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Hiring"
    },
    resetPasswordToken: {
        type : String,
    },
    resetPasswordExpires: {
        type : Date,
    },
    profilePic: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    registration_number: {
        type: String,
        default: ''
    },
    gst_number: {
        type: String,
        default: ''
    },
    logo: {
        type: String,
        default: null
    },
    signature: {
        type: String,
        default: null
    },
    offerLetters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OfferLetter'
  }]
 })

 module.exports = mongoose.model("Admin",adminSchema)