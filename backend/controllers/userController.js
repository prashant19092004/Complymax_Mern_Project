// const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const Leave = require("../models/leave.model");
const establishmentModel = require("../models/admin");
const supervisorModel = require("../models/supervisor.model");
const clientModel = require("../models/client.model");
const userModel = require("../models/user");
const educationModel = require("../models/education.model.js");
const experienceModel = require("../models/experience.model.js");
const hiringModel = require("../models/hiring.model.js");
const AWS = require("aws-sdk");
const hiredModel = require("../models/hired.model.js");
const Attendance = require("../models/attendance.model.js");
const moment = require("moment-timezone");



const rekognition = new AWS.Rekognition({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function base64ToBuffer(base64Image) {
  const base64Data = base64Image.replace(
    /^data:image\/(png|jpeg|jpg);base64,/,
    ""
  );
  return Buffer.from(base64Data, "base64");
}

// Convert base64 to binary stream
function base64ToBlob(base64Image) {
  const base64Data = base64Image.replace(
    /^data:image\/(png|jpeg|jpg);base64,/,
    ""
  );
  return Buffer.from(base64Data, "base64");
}

// User dashboard data fetching
// This function fetches the current user's data and sends it as a response.
exports.userDashboard = async (req, res) => {
  try {
    const currentUser = await userModel.findOne({
      _id: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "User dashboard data fetched successfully",
      currentUser,
    });
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user dashboard data",
    });
  }
};

exports.jobDashboard = async (req, res) => {
  try {
    const Hirings = await hiringModel
      .find({})
      .populate("establisment", { _id: 1, name: 1 }) // Ensure the correct field name is used
      .populate("location_id"); // Ensure this field is correct in the schema

    const currentUser = await userModel.findOne(
      { _id: req.user.id },
      { job: 1 }
    );

    res.status(200).json({
      message: "Hiring data fetched successfully",
      success: true,
      Hirings,
      currentUser,
    });
  } catch (e) {
    // Log the error to debug
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

exports.addUanEsic = async (req, res) => {
  const { uanNumber, esicNumber } = req.body;

  try {
    const currentUser = await userModel.findOne({ _id: req.user.id });

    currentUser.uan_number = uanNumber;
    currentUser.esic_number = esicNumber;
    currentUser.uan_esic_added = true;
    await currentUser.save();
    res.json({ message: "UAN and ESIC Added", success: true });
  } catch (err) {
    res.json({ message: "error Occured", success: false });
  }
};

exports.addAccount = async (req, res) => {
  const { account_number, data } = req.body;

  try {
    const currentUser = await userModel.findOne({ _id: req.user.id });

    if (currentUser.full_Name.toUpperCase() === data.full_name.toUpperCase()) {
      currentUser.account_number = account_number;
      currentUser.account_name = data.full_name;
      currentUser.account_added = true;
      currentUser.account_ifsc = data.ifsc_details.ifsc;
      await currentUser.save();
      res.json({ message: "Account Added", success: true });
    } else {
      res.json({
        message: "Name of Bank Account and Aadhar Card not matched",
        success: false,
      });
    }
  } catch (err) {
    res.json({ message: "Account not Added", success: false });
  }
};
exports.addPan = async (req, res) => {
  const { full_name, pan_number } = req.body;

  try {
    const currentUser = await userModel.findOne({ _id: req.user.id });

    if (currentUser.full_Name.toUpperCase() === full_name.toUpperCase()) {
      currentUser.pan_number = pan_number;
      currentUser.pan_name = full_name;
      currentUser.pan_added = true;
      await currentUser.save();
      res.json({ message: "Pan Added", success: true });
    } else {
      res.json({
        message: "Name of Pan Card and Aadhar Card not matched",
        success: false,
      });
    }
  } catch (err) {
    res.json({ message: "error Occured", success: false });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const user = await userModel.findOneAndUpdate(
      { _id: req.user.id },
      { profilePic: `/uploads/${req.file.filename}` },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.uploadPanImage = async (req, res) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { _id: req.user.id },
      { pan_image: `/uploads/${req.file.filename}` },
      { new: true, runValidators: false } // Disable validation for this update
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Pan card image uploaded successfully", user });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.uploadAadharFrontImage = async (req, res) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { _id: req.user.id },
      { aadhar_front_image: `/uploads/${req.file.filename}` },
      { new: true, runValidators: false }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Aadhar front image uploaded successfully", user });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
exports.uploadAadharBackImage = async (req, res) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { _id: req.user.id },
      { aadhar_back_image: `/uploads/${req.file.filename}` },
      { new: true, runValidators: false }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Aadhar back image uploaded successfully", user });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
exports.uploadAccountImage = async (req, res) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { _id: req.user.id },
      { account_image: `/uploads/${req.file.filename}` },
      { new: true, runValidators: false }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Account image uploaded successfully", user });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
exports.uploadCertificate = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { id, type } = req.body;
    const Model = type === "experience" ? experienceModel : educationModel;

    const entry = await Model.findById(id);
    if (!entry) {
      return res.status(404).json({ msg: `${type} entry not found` });
    }

    // Delete old certificate if exists
    if (entry.certificate) {
      const oldPath = path.join(__dirname, "..", "public", entry.certificate);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    entry.certificate = `/uploads/${req.file.filename}`;
    await entry.save();

    // Get updated user data
    const updatedUser = await userModel
      .findOne({ _id: req.user.id })
      .populate("qualifications")
      .populate("experiences");

    res.json({ msg: "Certificate uploaded successfully", user: updatedUser });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
exports.deleteAadharFrontImage = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Delete the file from uploads folder if needed
    if (user.aadhar_front_image) {
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        user.aadhar_front_image
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.aadhar_front_image = null;
    await user.save();

    res.json({ msg: "Aadhar card front image deleted successfully", user });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
exports.deleteAadharBackImage = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Delete the file from uploads folder if needed
    if (user.aadhar_back_image) {
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        user.aadhar_back_image
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.aadhar_back_image = null;
    await user.save();

    res.json({ msg: "Aadhar card back image deleted successfully", user });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
exports.deleteAccountImage = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Delete the file from uploads folder if needed
    if (user.account_image) {
      const filePath = path.join(__dirname, "..", "public", user.account_image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.account_image = null;
    await user.save();

    res.json({ msg: "Account image deleted successfully", user });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const { id, type } = req.body;
    const Model = type === "experience" ? experienceModel : educationModel;

    const entry = await Model.findById(id);
    if (!entry) {
      return res.status(404).json({ msg: `${type} entry not found` });
    }

    // Delete the file
    if (entry.certificate) {
      const filePath = path.join(__dirname, "..", "public", entry.certificate);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    entry.certificate = null;
    await entry.save();

    // Get updated user data
    const updatedUser = await userModel
      .findOne({ _id: req.user.id })
      .populate("qualifications")
      .populate("experiences");

    res.json({ msg: "Certificate deleted successfully", user: updatedUser });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
exports.addEducation = async (req, res) => {
  try {
    const {
      institute,
      degree,
      starting_month,
      starting_year,
      ending_month,
      ending_year,
      score,
      description,
      editId,
    } = req.body;

    if (
      !institute ||
      !degree ||
      !starting_month ||
      !starting_year ||
      !ending_month ||
      !ending_year ||
      !score
    ) {
      return res.json({ message: "Please Enter all the data", success: false });
    }

    if (editId !== "") {
      const currentEducation = await educationModel.findOne({ _id: editId });

      currentEducation.institute = institute;
      currentEducation.degree = degree;
      currentEducation.starting_month = starting_month;
      currentEducation.starting_year = starting_year;
      currentEducation.ending_month = ending_month;
      currentEducation.ending_year = ending_year;
      currentEducation.score = score;
      currentEducation.description = description;

      await currentEducation.save();

      const currentUser1 = await userModel
        .findOne({ _id: currentEducation.user })
        .populate("qualifications")
        .populate("experiences");

      return res
        .status(200)
        .json({ success: true, message: "education Updated", currentUser1 });
    }

    const currentUser = await userModel.findOne({
      _id: req.user.id,
    });

    const newEducation = await educationModel.create({
      institute,
      degree,
      starting_month,
      starting_year,
      ending_month,
      ending_year,
      score,
      description,
      user: currentUser._id,
    });

    currentUser.qualifications.push(newEducation._id);
    await currentUser.save();

    const currentUser1 = await userModel
      .findOne({
        _id: req.user.id,
      })
      .populate("qualifications")
      .populate("experiences");

    return res.status(200).json({
      success: true,
      message: "Education Added",
      currentUser1,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "plz try again later",
    });
  }
};
exports.deleteEducation = async (req, res) => {
  const { uid } = req.body;

  try {
    const currentEducation = await educationModel.deleteOne({ _id: uid });

    const currentUser = await userModel
      .findOne({ _id: req.user.id })
      .populate("qualifications")
      .populate("experiences");
    // currentEducation.deleteOne();

    return res
      .status(200)
      .json({ message: "education deleted", success: true, currentUser });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error", success: false });
  }
};
exports.addExperience = async (req, res) => {
  try {
    const {
      company,
      role,
      starting_month,
      starting_year,
      ending_month,
      ending_year,
      location,
      description,
      editId,
    } = req.body;

    if (!company || !role || !starting_month || !starting_year || !location) {
      return res.status(400).json({
        message: "Please Enter all the required data",
        success: false,
      });
    }

    if (editId && editId !== "") {
      const currentExperience = await experienceModel.findOne({ _id: editId });

      if (!currentExperience) {
        return res.status(404).json({
          success: false,
          message: "Experience not found",
        });
      }

      currentExperience.company = company;
      currentExperience.role = role;
      currentExperience.starting_month = starting_month;
      currentExperience.starting_year = starting_year;
      currentExperience.ending_month = ending_month || "";
      currentExperience.ending_year = ending_year || "";
      currentExperience.location = location;
      currentExperience.description = description || "";

      await currentExperience.save();

      const currentUser1 = await userModel
        .findOne({ _id: currentExperience.user })
        .populate("qualifications")
        .populate("experiences");

      return res.status(200).json({
        success: true,
        message: "Experience Updated",
        currentUser1,
      });
    }

    const currentUser = await userModel.findOne({ _id: req.user.id });
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newExperience = await experienceModel.create({
      company,
      role,
      starting_month,
      starting_year,
      ending_month: ending_month || "",
      ending_year: ending_year || "",
      location,
      description: description || "",
      user: currentUser._id,
    });

    currentUser.experiences.push(newExperience._id);
    await currentUser.save();

    const currentUser1 = await userModel
      .findOne({ _id: req.user.id })
      .populate("qualifications")
      .populate("experiences");

    return res.status(200).json({
      success: true,
      message: "Experience Added",
      currentUser1,
    });
  } catch (err) {
    console.error("Add experience error:", err);
    return res.status(500).json({
      success: false,
      message: "Please try again later",
    });
  }
};
exports.deleteExperience = async (req, res) => {
  const { uid } = req.body;

  try {
    const currentExperience = await experienceModel.deleteOne({ _id: uid });

    const currentUser = await userModel
      .findOne({ _id: req.user.id })
      .populate("qualifications")
      .populate("experiences");

    return res
      .status(200)
      .json({ message: "experience deleted", success: true, currentUser });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error", success: false });
  }
};
exports.deletePanImage = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Delete the file from uploads folder if needed
    if (user.pan_image) {
      const filePath = path.join(__dirname, "..", "public", user.pan_image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.pan_image = null;
    await user.save();

    res.json({ msg: "Pan card image deleted successfully", user });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
//profile data fetching
exports.profileData = async (req, res) => {
  // const requestHistory = await requestModel.find(req.user._id.equals(user));

  const currentUser = await userModel
    .findOne({ _id: req.user.id })
    .populate("qualifications")
    .populate("experiences");

  res.send(currentUser);
};

// Upload signature
exports.uploadSignature = async (req, res) => {
  try {
    // console.log('Upload request received:', req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No signature file provided",
      });
    }

    const user = await userModel.findById(req.user.id);
    if (!user) {
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old signature if exists
    if (user.signature) {
      const oldPath = path.join(__dirname, "..", "uploads", user.signature);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Store just the filename with /uploads prefix
    user.signature = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      message: "Signature uploaded successfully",
      user: {
        ...user.toObject(),
        signature: `/uploads/${req.file.filename}`,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading signature",
    });
  }
};

// Delete signature
exports.deleteSignature = async (req, res) => {
  try {
    // console.log('Delete request received for user:', req.user.id);

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.signature) {
      const signaturePath = path.join(
        __dirname,
        "..",
        "uploads",
        user.signature.replace("/uploads/", "")
      );
      // console.log('Attempting to delete file at:', signaturePath);

      try {
        if (fs.existsSync(signaturePath)) {
          fs.unlinkSync(signaturePath);
          // console.log('File deleted successfully');
        }
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
        // Continue even if file deletion fails
      }

      // Update database
      user.signature = "";
      await user.save();
      // console.log('Database updated successfully');

      res.json({
        success: true,
        message: "Signature deleted successfully",
        user: user.toObject(),
      });
    } else {
      res.json({
        success: true,
        message: "No signature found to delete",
        user: user.toObject(),
      });
    }
  } catch (error) {
    console.error("Error in deleteSignature:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting signature",
      error: error.message,
    });
  }
};

exports.leavePageData = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await userModel
      .findById(userId)
      .select(
        "full_Name email establisment hired leaveTaken casualLeave earnedLeave medicalLeave"
      )
      .populate({
        path: "hired",
        select: "hiring_id supervisor_id establishment_id",
        populate: [
          {
            path: "hiring_id",
            select: "client_id job_category",
          },
          {
            path: "supervisor_id",
            select: "name _id",
          },
          {
            path: "establishment_id",
            select: "_id casualLeave medicalLeave earnedLeave",
          },
        ],
      });

    const leaveRequests = await Leave.find({ user_id: userId });

    res.status(200).json({
      success: true,
      message: "user data has fetched",
      userData,
      leaveRequests,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: error.message,
    });
  }
};

exports.leaveApplication = async (req, res) => {
  try {
    const {
      establishment_id,
      supervisor_id,
      client_id,
      reportingManager,
      leaveType,
      leaveSubType,
      reason,
      from,
      to,
    } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user

    const leave = new Leave({
      establishment_id,
      supervisor_id,
      client_id,
      user_id: userId,
      reportingManager,
      leaveType,
      leaveSubType,
      reason,
      from,
      to,
      status: "Pending",
      // Add other fields as needed
    });

    await leave.save();

    const establishment = await establishmentModel
      .findById(establishment_id)
      .select("leaveRequests");

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: "Establishment not found",
      });
    }
    // Add the leave request to the establishment's leaveRequests array
    establishment.leaveRequests.push(leave._id);
    await establishment.save();

    const user = await userModel.findById(userId).select("leaveRequests");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Add the leave request to the user's leaveRequests array
    user.leaveRequests.push(leave._id);
    await user.save();

    const supervisor = await supervisorModel
      .findById(supervisor_id)
      .select("leaveRequests");
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }
    // Add the leave request to the supervisor's leaveRequests array
    supervisor.leaveRequests.push(leave._id);
    await supervisor.save();

    const client = await clientModel
      .findById(client_id)
      .select("leaveRequests");
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Add the leave request to the client's leaveRequests array
    client.leaveRequests.push(leave._id);
    await client.save();

    // Fetch all leave requests for the user to return in the response
    const leaveRequests = await Leave.find({ user_id: userId });

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      leave,
      leaveRequests,
    });
  } catch (error) {
    console.error("Error applying leave:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting leave request",
      error: error.message,
    });
  }
};

exports.attendanceUserData = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await userModel
      .findById(userId)
      .select("full_Name email face faceAdded attendance leaveTaken")
      .populate({
        path: "attendance",
        options: { sort: { date: -1 } },
        select:
          "_id totalHours status checkInTime date establishment checkOutTime",
        populate: {
          path: "establishment",
          select: "earnedLeave casualLeave medicalLeave",
        },
      });

    // const leaveRequests = await Leave.find({ user_id : userId });

    res.status(200).json({
      success: true,
      message: "user data has fetched",
      userData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: error.message,
    });
  }
};

exports.uploadFace = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Face data is required",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the face field
    user.face = image;
    user.faceAdded = true; // Set faceAdded to true
    await user.save();

    res.json({
      success: true,
      message: "Face updated successfully",
      // user: {
      //   ...user.toObject(),
      //   face: image
      // }
    });
  } catch (error) {
    console.error("Error updating face:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating face",
    });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image, location } = req.body;

    if (!image || !location) {
      return res.status(400).json({
        success: false,
        message: "Image and location are required.",
      });
    }

    const user = await userModel
      .findById(userId)
      .select("face faceAdded supervisor hired")
      .populate({
        path: "hired",
        select: "hiring_id supervisor_id establishment_id _id",
        populate: [
          {
            path: "supervisor_id",
            select: "name email _id reportingLocation checkInTime checkOutTime",
          },
          {
            path: "hiring_id",
            select: "client_id",
          },
        ],
      });

    const supervisor = user?.hired?.supervisor_id;
    if (!supervisor || !supervisor.reportingLocation) {
      return res.status(400).json({
        success: false,
        message: "Supervisor reporting location not found.",
      });
    }

    const { latitude: supLat, longitude: supLng } =
      supervisor.reportingLocation;
    const { latitude, longitude } = location;

    const distance = getDistanceFromLatLonInMeters(
      latitude,
      longitude,
      supLat,
      supLng
    );
    if (distance > supervisor.reportingLocation.reportingRadius) {
      return res.status(400).json({
        success: false,
        message:
          "You are not within the allowed 100m radius of your reporting location.",
      });
    }

    // Face Recognition Check using AWS Rekognition
    const sourceImageBuffer = base64ToBuffer(user.face);
    const targetImageBuffer = base64ToBuffer(image);

    const params = {
      SourceImage: { Bytes: sourceImageBuffer },
      TargetImage: { Bytes: targetImageBuffer },
      SimilarityThreshold: 90,
    };

    const compareResult = await rekognition.compareFaces(params).promise();
    if (!compareResult.FaceMatches || compareResult.FaceMatches.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Face does not match the registered profile.",
      });
    }

    // Time in IST for calculations
    const istNow = moment().tz("Asia/Kolkata");
    const startOfDayUTC = istNow.clone().startOf("day").utc().toDate();
    const endOfDayUTC = istNow.clone().endOf("day").utc().toDate();

    const existingRecord = await Attendance.findOne({
      user: userId,
      date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    });

    if (existingRecord && existingRecord.checkInTime) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today.",
      });
    }

    const attendanceData = existingRecord || new Attendance({ user: userId });

    // Late By calculation using supervisor's expected time
    const expectedCheckInStr = supervisor.checkInTime;
    let lateByMinutes = 0;

    if (expectedCheckInStr) {
      const [expectedHour, expectedMinute] = expectedCheckInStr
        .split(":")
        .map(Number);
      const expectedCheckInIST = istNow.clone().set({
        hour: expectedHour,
        minute: expectedMinute,
        second: 0,
        millisecond: 0,
      });

      const diffMinutes = istNow.diff(expectedCheckInIST, "minutes");
      lateByMinutes = diffMinutes > 0 ? diffMinutes : 0;
    }

    // Save all times in UTC
    attendanceData.checkInTime = istNow.clone().utc().toDate();
    attendanceData.date = istNow.clone().startOf("day").utc().toDate();
    attendanceData.createdAt = new Date(); // server time (UTC)

    attendanceData.checkInLocation.latitude = location.latitude;
    attendanceData.checkInLocation.longitude = location.longitude;
    attendanceData.checkInImage = image;

    attendanceData.user = userId;
    attendanceData.geoFencePassed = true;
    attendanceData.faceVerified = true;
    attendanceData.status = "Present";
    attendanceData.hiredId = user.hired._id;
    attendanceData.supervisor = supervisor._id;
    attendanceData.establishment = user.hired.establishment_id;
    attendanceData.client = user.hired.hiring_id.client_id;
    attendanceData.lateByMinutes = lateByMinutes;

    await attendanceData.save();

    // Push attendance to related entities
    await Promise.all([
      supervisorModel.findByIdAndUpdate(supervisor._id, {
        $push: { attendance: attendanceData._id },
      }),
      userModel.findByIdAndUpdate(userId, {
        $push: { attendance: attendanceData._id },
      }),
      establishmentModel.findByIdAndUpdate(user.hired.establishment_id, {
        $push: { attendance: attendanceData._id },
      }),
      clientModel.findByIdAndUpdate(user.hired.hiring_id.client_id, {
        $push: { attendance: attendanceData._id },
      }),
      hiredModel.findByIdAndUpdate(user.hired._id, {
        $push: { attendance: attendanceData._id },
      }),
    ]);

    res.status(200).json({ success: true, message: "Check-in recorded." });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image, location } = req.body;

    if (!image || !location) {
      return res.status(400).json({
        success: false,
        message: "Image and location are required.",
      });
    }

    const user = await userModel
      .findById(userId)
      .select("face hired")
      .populate({
        path: "hired",
        select: "supervisor_id",
        populate: {
          path: "supervisor_id",
          select: "reportingLocation checkOutTime",
        },
      });

    const supervisor = user?.hired?.supervisor_id;
    if (!supervisor || !supervisor.reportingLocation) {
      return res.status(400).json({
        success: false,
        message: "Supervisor reporting location not found.",
      });
    }

    const { latitude: supLat, longitude: supLng } =
      supervisor.reportingLocation;
    const { latitude, longitude } = location;

    const distance = getDistanceFromLatLonInMeters(
      latitude,
      longitude,
      supLat,
      supLng
    );
    if (distance > supervisor.reportingLocation.reportingRadius) {
      return res.status(400).json({
        success: false,
        message: `You are not within the allowed ${supervisor.reportingLocation.reportingRadius}m radius of your reporting location.`,
      });
    }

    // Face Recognition Check using AWS Rekognition
    const sourceImageBuffer = base64ToBuffer(user.face);
    const targetImageBuffer = base64ToBuffer(image);

    const params = {
      SourceImage: { Bytes: sourceImageBuffer },
      TargetImage: { Bytes: targetImageBuffer },
      SimilarityThreshold: 90,
    };

    const compareResult = await rekognition.compareFaces(params).promise();
    if (!compareResult.FaceMatches || compareResult.FaceMatches.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Face does not match the registered profile.",
      });
    }

    // Get start and end of day in IST to query MongoDB
    const startOfDayIST = moment().tz("Asia/Kolkata").startOf("day");
    const endOfDayIST = moment().tz("Asia/Kolkata").endOf("day");

    const startOfDayUTC = startOfDayIST.clone().utc().toDate();
    const endOfDayUTC = endOfDayIST.clone().utc().toDate();

    const attendanceRecord = await Attendance.findOne({
      user: userId,
      date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    });

    if (!attendanceRecord || !attendanceRecord.checkInTime) {
      return res.status(400).json({
        success: false,
        message: "No check-in record found for today.",
      });
    }

    if (attendanceRecord.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "Already checked out today.",
      });
    }

    // IST logic for calculations
    const checkInIST = moment(attendanceRecord.checkInTime).tz("Asia/Kolkata");
    const checkOutIST = moment().tz("Asia/Kolkata");

    const totalHours = +(checkOutIST.diff(checkInIST, "minutes") / 60).toFixed(
      2
    );

    let earlyCheckOutByMinutes = 0;
    let overtimeMinutes = 0;

    const expectedCheckOutStr = supervisor.checkOutTime; // "18:00"
    if (expectedCheckOutStr) {
      const [expectedHour, expectedMinute] = expectedCheckOutStr
        .split(":")
        .map(Number);
      const expectedCheckOutIST = checkOutIST.clone().set({
        hour: expectedHour,
        minute: expectedMinute,
        second: 0,
        millisecond: 0,
      });

      const diffMinutes = checkOutIST.diff(expectedCheckOutIST, "minutes");

      if (diffMinutes < 0) {
        earlyCheckOutByMinutes = Math.abs(diffMinutes);
      } else {
        overtimeMinutes = diffMinutes;
      }
    }

    // Save everything in UTC
    attendanceRecord.checkOutTime = checkOutIST.clone().utc().toDate();
    attendanceRecord.checkOutLocation.latitude = location.latitude;
    attendanceRecord.checkOutLocation.longitude = location.longitude;
    attendanceRecord.checkOutImage = image;
    attendanceRecord.updatedAt = new Date(); // UTC by default
    attendanceRecord.totalHours = totalHours;
    attendanceRecord.earlyCheckOutByMinutes = earlyCheckOutByMinutes;
    attendanceRecord.overtimeMinutes = overtimeMinutes;

    await attendanceRecord.save();

    res.status(200).json({
      success: true,
      message: "Check-out recorded successfully.",
    });
  } catch (err) {
    console.error("Check-out error:", err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
