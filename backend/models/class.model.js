const mongoose = require("mongoose")

const classSchema = new mongoose.Schema({
    date : {
        type : Date,
        default : Date.now
    },
    trainer_entry_hour: {
        type: String,
        // required: true, 
    },
    trainer_entry_minute: {
        type: String, 
        // required: true, 
    },
    trainer_entry_shift: {
        type: String, 
        // required: true,
    },
    trainer_exit_hour: {
        type: String,
        // required: true, 
    },
    trainer_exit_minute: {
        type: String, 
        // required: true, 
    },
    trainer_exit_shift: {
        type: String, 
        // required: true,
    },
    trainer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Trainer"
    },
    subject : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subject"
    },
    class_topic : {
        type : String
    },
    feedback : {
        type : String
    }
})

module.exports = mongoose.model("Class", classSchema);