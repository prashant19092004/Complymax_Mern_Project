const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    full_Name: {
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
    contact : {
        type:String,
        required : true
    },
    aadhar_number : {
        type:String,
        required : true
    },
    country : {
        type:String,
        required : true
    },
    dist : {
        type:String,
    },
    house : {
        type : String
    },
    landmark : {
        type : String
    },    
    loc : {
        type : String
    },
    po : {
        type : String
    },
    state : {
        type : String
    },
    street : {
        type : String
    },
    subdist : {
        type : String
    },
    vtc : {
        type : String
    },
    care_of : {
        type : String
    },
    dob : {
        type : String
    },
    gender : {
        type : String
    },
    has_image : {
        type : Boolean
    },
    aadhar_image : {
        type : String
    },
    zip : {
        type : String
    },
    profile_pic : {
        type : String
    },
    pan_added : {
        type : Boolean,
        default : false
    },
    pan_name : {
        type : String
    },
    pan_number : {
        type : String
    },
    account_added : {
        type : Boolean,
        default : false
    },
    account_name : {
        type : String
    },
    account_number : {
        type : String
    },
    account_ifsc : {
        type : String
    },
    establisment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Admin"
    },
    job : {
        type : Boolean,
        default : false
    },
    qualifications: {
        type: [mongoose.Schema.Types.ObjectId],
        ref : "Education"
    },
    experiences: {
        type: [mongoose.Schema.Types.ObjectId],
        ref : "Experience"
    },
    hired : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Hired'
    },
 })

 module.exports = mongoose.model("User",userSchema)