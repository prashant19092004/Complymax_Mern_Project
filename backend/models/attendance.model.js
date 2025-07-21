const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hiredId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hired",
    required: true,
  },
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supervisor",
  },

  // Core attendance tracking
  date: {
    type: Date,
    required: true,
  },
  checkInTime: {
    type: Date,
  },
  checkOutTime: {
    type: Date,
  },
  totalHours: {
    type: Number, // calculated in hours
    default: 0,
  },

  // Status tracking
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave", "First Half Leave", "Second Half Leave"],
    default: "Absent",
  },
  lateByMinutes: {
    type: Number,
    default: 0,
  },
  earlyCheckOutByMinutes: {
    type: Number,
    default: 0,
  },
  overtimeMinutes: {
    type: Number,
    default: 0,
  },

  // Geo & face verification
  checkInImage: {
    type: String, // URL or base64
  },
  checkInLocation: {
    latitude: Number,
    longitude: Number,
  },
  checkOutImage: {
    type: String, // URL or base64
  },
  checkOutLocation: {
    latitude: Number,
    longitude: Number,
  },
  geoFencePassed: {
    type: Boolean,
    default: false,
  },
  faceVerified: {
    type: Boolean,
    default: false,
  },

  // Audit
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Enforce 1 record per employee per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

attendanceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);
