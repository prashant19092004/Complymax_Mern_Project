const mongoose = require('mongoose');


const hiredSchema = new mongoose.Schema({
    hiring_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Hiring'
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    supervisor_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Supervisor'
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    status : {
        type : String,
        default : '1'
    }
})

module.exports = mongoose.model("Hired", hiredSchema);