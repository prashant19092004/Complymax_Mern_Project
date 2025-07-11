const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "official",
      "weekend",
      "custom"
    ],
    default: "official",
  },
  state: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "India",
  },
  location: {
    type: String,
    default: "All",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});


module.exports = mongoose.model("Holiday", holidaySchema);
