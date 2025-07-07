const mongoose = require("mongoose");

const supervisorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  contact: {
    type: String,
    trim: true,
    required: true,
  },
  establisment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  locations: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Clientlocation",
  },
  hired: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Hired",
    default: [],
  },
  status: {
    type: Boolean,
    default: true,
  },
  offerLetters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfferLetter",
    },
  ],
  leaveRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
    },
  ],
  attendance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
    },
  ],
  reportingLocation: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    areaName: {
      type: String,
    },
    reportingRadius: {
      type: Number,
      default: 100, // Default radius in meters
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  checkInTime: {
    type: String,
    default: null,
  },
  checkOutTime: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Supervisor", supervisorSchema);
