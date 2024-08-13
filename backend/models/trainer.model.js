const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    subject : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Subject"
    },
    mob : {
        type : Number,
        required : true
    },
    address : {
        type : String
    }
});

module.exports = mongoose.model("Trainer", trainerSchema);