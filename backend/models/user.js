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
    employeeId : {
        type : Number,
    },
    contact : {
        type:String,
        required : true
    },
    aadhar_number : {
        type:String,
        required : true
    },
    kyc : {
        type : Boolean,
        default : false
    },
    country : {
        type:String,
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
    hired: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hired',
        default: null // no reference by default
    },
    resetPasswordToken: {
        type : String,
    },
    resetPasswordExpires: {
        type : Date,
    },
    profilePic: {
        type: String, // The path to the uploaded image
        default: ''
    },
    date_of_joining : {
        type : Date,
    },
    pf_esic_status : {
        type : Boolean,
        default : false
    },
    date_of_joining_status : {
        type : Boolean,
        default : false
    },
    basic : {
        type : String,
    },
    da : {
        type : String,
    },
    hra : {
        type : String,
    },
    other_allowance : {
        type : String,
    },
    leave_with_wages : {
        type : String
    },
    wages_status : {
        type : Boolean,
        default : false
    },
    active_user_status : {
        type : Boolean,
        default : false
    },
    uan_number : {
        type : String,
    },
    epf_number : {
        type : String,
    },
    esic_number : {
        type : String,
    },
    uan_esic_added : {
        type : Boolean,
        default : false
    },
    file1 : {
        type : String
    },
    file2 : {
        type : String
    },
    pan_image: {
        type: String,
        default: ''
    },
 })

 module.exports = mongoose.model("User",userSchema)