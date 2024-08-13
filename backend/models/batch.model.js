const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
    batch_name : {
        type : String,
        required : true
    },
    created_date : {
        type : Date,
        default : Date.now
    },
    status : {
        type : Boolean,
        default : false
    },
    trainings : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Subject"
    },
    semester : {
        type : String
    }
})


module.exports = mongoose.model("Batch", batchSchema);