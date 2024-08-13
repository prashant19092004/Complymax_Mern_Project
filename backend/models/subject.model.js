const mongoose = require("mongoose")

// const topicSchema = new mongoose.Schema({
//     topic_name : {
//         type : String,
//         required : true
//     },
//     status : {
//         type : Boolean,
//         default : false
//     }
// });

const subjectSchema = new mongoose.Schema({
    subject_name : {
        type : String,
        required : true,
        trim : true
    },
    batch : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Batch"
    },
    syllabus : {
        type : [String]
    },
    classes : {
        type : [mongoose.Schema.Types.ObjectId],
        ref: "Class"
    },
    trainer: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Trainer"
    }
});

module.exports = mongoose.model("Subject", subjectSchema);