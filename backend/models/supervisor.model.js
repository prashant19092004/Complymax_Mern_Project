const mongoose = require('mongoose');

const supervisorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique  : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    contact : {
        type : String,
        trim : true,
        required : true
    },
    establisment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Admin"
    },
    locations : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Clientlocation'
    },
    // state : {
    //     type : String,
    //     required : true
    // },
    // location : {
    //     type : String,
    //     required : true
    // },
    status : {
        type : Boolean,
        default : true
    }
});

module.exports = mongoose.model("Supervisor", supervisorSchema);