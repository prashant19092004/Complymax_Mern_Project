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
    contact : {
        typr : String,
    },
    email : {
        type : String
    },
    skill : {
        type : String
    },
    no_of_jobs : {
        type : Number
    },
    state : {
        type : String
    },
    location : {
        type : String
    }
})

module.exports = mongoose.model("Hiring", hiringSchema);