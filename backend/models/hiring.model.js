const mongoose = require('mongoose');


const hiringSchema = new mongoose.Schema({
    client_name : {
        type : String,
        trim : true
    },
    client_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Client'
    },
    skill : {
        type : String
    },
    job_category : {
        type : String
    },
    no_of_hiring : {
        type : Number
    },
    state : {
        type : String
    },
    location : {
        type : String
    },
    establisment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Admin"
    },
    location_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Location"
    }
})

module.exports = mongoose.model("Hiring", hiringSchema);