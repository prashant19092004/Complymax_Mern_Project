const mongoose = require("mongoose");

const clientlocationSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
    // trim: true,
  },
  name: {
    type: String,
    // required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  hirings: {
    type: [mongoose.Schema.Types.ObjectId],
    REF: "Hiring",
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor",
  },
  attendance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
    },
  ],
});

module.exports = mongoose.model("Clientlocation", clientlocationSchema);
