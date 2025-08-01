const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_Name: {
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
    employeeId: {
      type: Number,
    },
    contact: {
      type: String,
      required: true,
    },
    aadhar_number: {
      type: String,
      required: true,
    },
    kyc: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
    },
    dist: {
      type: String,
    },
    house: {
      type: String,
    },
    landmark: {
      type: String,
    },
    loc: {
      type: String,
    },
    po: {
      type: String,
    },
    state: {
      type: String,
    },
    street: {
      type: String,
    },
    subdist: {
      type: String,
    },
    vtc: {
      type: String,
    },
    care_of: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    has_image: {
      type: Boolean,
    },
    aadhar_image: {
      type: String,
      default: "",
    },
    zip: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
    pan_added: {
      type: Boolean,
      default: false,
    },
    pan_name: {
      type: String,
    },
    pan_number: {
      type: String,
    },
    account_added: {
      type: Boolean,
      default: false,
    },
    account_name: {
      type: String,
    },
    account_number: {
      type: String,
    },
    account_ifsc: {
      type: String,
    },
    establisment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
    },
    job: {
      type: Boolean,
      default: false,
    },
    qualifications: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Education",
    },
    experiences: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Experience",
    },
    hired: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hired",
      default: null, // no reference by default
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    profilePic: {
      type: String, // The path to the uploaded image
      default: "",
    },
    date_of_joining: {
      type: Date,
    },
    pf_esic_status: {
      type: Boolean,
      default: false,
    },
    date_of_joining_status: {
      type: Boolean,
      default: false,
    },
    basic: {
      type: String,
    },
    da: {
      type: String,
    },
    hra: {
      type: String,
    },
    other_allowance: {
      type: String,
    },
    leave_with_wages: {
      type: String,
    },
    wages_status: {
      type: Boolean,
      default: false,
    },
    active_user_status: {
      type: Boolean,
      default: false,
    },
    uan_number: {
      type: String,
    },
    epf_number: {
      type: String,
    },
    esi_number: {
      type: String,
      default: "",
    },
    esic_number: {
      type: String,
    },
    uan_esic_added: {
      type: Boolean,
      default: false,
    },
    file1: {
      type: String,
    },
    file2: {
      type: String,
    },
    pan_image: {
      type: String,
      default: "",
    },
    account_image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "client", "supervisor", "employee"],
      required: true,
      default: "employee",
    },
    aadhar_front_image: {
      type: String,
      default: "",
    },
    aadhar_back_image: {
      type: String,
      default: "",
    },
    signature: {
      type: String,
      default: "",
    },
    offerLetters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OfferLetter",
      },
    ],
    sentOfferLetters: [
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
    leaveTaken: {
      type: Number,
      default: 0,
    },
    casualLeave: {
      type: Number,
      default: 0,
    },
    earnedLeave: {
      type: Number,
      default: 0,
    },
    medicalLeave: {
      type: Number,
      default: 0,
    },
    leaveYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    leaveHistory: [
      {
        year: Number,
        totalLeaves: Number,
      },
    ],
    medicalLeaveHistory: [
      {
        year: Number,
        totalLeaves: Number,
      },
    ],
    earnedLeaveHistory: [
      {
        year: Number,
        totalLeaves: Number,
      },
    ],
    casualLeaveHistory: [
      {
        year: Number,
        totalLeaves: Number,
      },
    ],
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
      },
    ],
    face: {
      type: String,
      default: "",
    },
    faceAdded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
