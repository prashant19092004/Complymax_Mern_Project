const Admin = require("../models/admin");
const userModel = require("../models/user.js");
const clientModel = require("../models/client.model");
const adminModel = require("../models/admin");
const supervisorModel = require("../models/supervisor.model.js");
const LeaveRequestModel = require("../models/leave.model");
const clientlocationModel = require("../models/clientlocation.model.js"); 
const holidayModel = require("../models/holiday.model.js");
const hiringModel = require("../models/hiring.model.js");
const hiredModel = require("../models/hired.model.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const bcrpt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.dashboardData = async (req, res) => {
  // const requestHistory = await requestModel.find(req.user._id.equals(user));
  const currentEstablisment = await adminModel
    .findOne({
      _id: req.user.id,
    })
    .populate({
      path: "clients",
      populate: {
        path: "locations",
        model: "Clientlocation",
      },
    })
    .populate("hirings");
  res.send(currentEstablisment);
};

exports.getEstablishmentProfile = async (req, res) => {
  // const requestHistory = await requestModel.find(req.user._id.equals(user));
  const currentEstablisment = await adminModel
    .findOne({
      _id: req.user.id,
    })
    .populate({
      path: "clients",
      populate: {
        path: "locations",
        model: "Clientlocation",
      },
    })
    .populate("hirings");
  res.send(currentEstablisment);
};

exports.getClientData = async (req, res) => {
  const { state } = req.body;

  try {
    const clientDetail = await clientModel
      .findOne({ _id: state })
      .populate("locations");

    const currentEstablisment = await adminModel
      .findOne({ _id: clientDetail.establisment })
      .populate("supervisors");

    res.json({
      message: "check",
      data: clientDetail,
      supervisors: currentEstablisment.supervisors,
      success: true,
    });
  } catch (err) {
    res.json({ message: err, success: false });
  }
};

exports.deleteLocation = async (req, res) => {
  const { uid, client_id, supervisor_id } = req.body;

  try {
    const previousSupervisor = await supervisorModel.findOne({
      _id: supervisor_id,
    });
    const index = previousSupervisor.locations.indexOf(uid);

    if (index > -1) {
      previousSupervisor.locations.splice(index, 1);
      await previousSupervisor.save();
    }

    const currentLocation = await clientlocationModel.deleteOne({ _id: uid });

    const currentClient = await clientModel
      .findOne({ _id: client_id })
      .populate("locations");
    // .populate('experiences')
    // currentEducation.deleteOne();

    return res
      .status(200)
      .json({ message: "location deleted", success: true, currentClient });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error", success: false });
  }
};
exports.addLocation = async (req, res) => {
  try {
    const {
      // name,
      // contact,
      location,
      state,
      // email,
      editId,
      client_id,
      supervisor,
    } = req.body;

    const arr = supervisor.split(",");

    if (!location || !state) {
      res.json({ message: "Please Enter all the data", success: false });
    }

    if (editId !== "") {
      const currentLocation = await clientlocationModel.findOne({
        _id: editId,
      });

      const previousSupervisor = await supervisorModel.findOne({
        _id: currentLocation.supervisor,
      });
      const index = previousSupervisor.locations.indexOf(currentLocation._id);

      if (index > -1) {
        previousSupervisor.locations.splice(index, 1);
        await previousSupervisor.save();
      }

      // currentLocation.name = name;
      // currentLocation.email = email;
      // currentLocation.contact = contact;
      currentLocation.state = state;
      currentLocation.location = location;
      currentLocation.supervisor = arr[0];

      await currentLocation.save();

      const currentSupervisor = await supervisorModel.findOne({ _id: arr[0] });
      currentSupervisor.locations.push(currentLocation._id);
      await currentSupervisor.save();

      const currentClient = await clientModel
        .findOne({ _id: currentLocation.client })
        .populate("locations");
      // .populate('experiences')

      return res
        .status(200)
        .json({ success: true, message: "Location Updated", currentClient });
    }

    const currentClient1 = await clientModel.findOne({
      _id: client_id,
    });

    const newLocation = await clientlocationModel.create({
      // name,
      // contact,
      state,
      location,
      // email,
      client: currentClient1._id,
      supervisor: arr[0],
    });

    currentClient1.locations.push(newLocation._id);
    await currentClient1.save();

    const currentSupervisor = await supervisorModel.findOne({ _id: arr[0] });
    currentSupervisor.locations.push(newLocation._id);
    await currentSupervisor.save();

    const currentClient = await clientModel
      .findOne({
        _id: client_id,
      })
      .populate("locations");
    // .populate('experiences')

    return res.status(200).json({
      success: true,
      message: "Location Added",
      currentClient,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "plz try again later",
    });
  }
};

exports.getHirings = async (req, res) => {
  try {
    const currentEstablisment = await adminModel
      .findOne({ _id: req.user.id })
      .populate("hirings");

    res.status(200).json({ success: true, currentEstablisment });
  } catch (e) {
    res.status(500).json({ success: false, message: "Interna Server Error" });
  }
};

exports.getClientList = async (req, res) => {
  const currentEstablisment = await adminModel
    .findOne({
      _id: req.user.id,
    })
    .populate("clients");

  res.send(currentEstablisment);
};

exports.editClient = async (req, res) => {
  try {
    const { _id, name, email, password, contact } = req.body;

    const currentClient = await clientModel.findOne({ _id });

    currentClient.name = name;
    currentClient.email = email;
    currentClient.contact = contact;
    currentClient.password = password;

    await currentClient.save();

    const currentEstablisment = await adminModel
      .findOne({
        _id: req.user.id,
      })
      .populate("clients");

    res
      .status(200)
      .json({ message: "Client Edited", success: true, currentEstablisment });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

exports.postHiring = async (req, res) => {
  const {
    client,
    no_of_hiring,
    state,
    location,
    skill,
    job_category,
    client_id,
    location_id,
  } = req.body;

  const arr = client.split(",");
  let client_name = arr[1];
  try {
    const newHiring = await hiringModel.create({
      client_name,
      client_id,
      skill,
      no_of_hiring,
      state,
      location,
      establisment: req.user.id,
      job_category,
      location_id,
    });
    const currentEstablisment1 = await adminModel.findOne({ _id: req.user.id });
    currentEstablisment1.hirings.push(newHiring._id);
    await currentEstablisment1.save();

    const currentClient = await clientModel.findOne({ _id: client_id });
    currentClient.hirings.push(newHiring._id);
    await currentClient.save();

    const currentLocation = await clientlocationModel.findOne({
      _id: location_id,
    });
    currentLocation.hirings.push(newHiring._id);
    await currentLocation.save();

    const currentEstablisment = await adminModel
      .findOne({ _id: req.user.id })
      .populate("hirings");

    res
      .status(200)
      .json({ success: true, message: "Hiring Posted", currentEstablisment });
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

exports.getSupervisorData = async (req, res) => {
  const { state } = req.body;

  try {
    const supervisorDetail = await supervisorModel.findOne({ _id: state });
    res.json({ message: "fetched", data: supervisorDetail, success: true });
  } catch (err) {
    res.json({ message: err, success: false });
  }
};

exports.getSupervisorList = async (req, res) => {
  const currentEstablisment = await adminModel
    .findOne({
      _id: req.user.id,
    })
    .populate("supervisors");

  res.send(currentEstablisment);
};

exports.editSupervisor = async (req, res) => {
  try {
    const { _id, name, email, password, contact } = req.body;

    const currentSupervisor = await supervisorModel.findOne({ _id });

    currentSupervisor.name = name;
    currentSupervisor.email = email;
    currentSupervisor.contact = contact;
    currentSupervisor.password = password;

    await currentSupervisor.save();

    const currentEstablisment = await adminModel
      .findOne({
        _id: req.user.id,
      })
      .populate("supervisors");

    res.status(200).json({
      message: "Supervisor Edited",
      success: true,
      currentEstablisment,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

exports.addUserAccount = async (req, res) => {
  const { account_number, data, userId } = req.body;

  try {
    const currentUser = await userModel.findOne({ _id: userId });

    currentUser.account_number = account_number;
    currentUser.account_name = data.full_name;
    currentUser.account_added = true;
    currentUser.account_ifsc = data.ifsc_details.ifsc;
    await currentUser.save();
    res.json({ message: "Account Added", success: true });
  } catch (err) {
    res.json({ message: "Account not Added", success: false });
  }
};

exports.getActiveUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({ active_user_status: true })
      .populate("hired");

    const currentEstablishment = await adminModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    let activeUsers = [];

    for (let i = 0; i < users.length; i++) {
      if (users[i].hired.establishment_id.equals(currentEstablishment._id)) {
        activeUsers.push(users[i]);
      }
    }

    res.status(200).json({
      message: "Active Users List fetched",
      success: true,
      activeUsers,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

exports.getPendingWages = async (req, res) => {
  try {
    const wages = await userModel
      .find({ date_of_joining_status: true, wages_status: false })
      .populate("hired");

    const currentEstablishment = await adminModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    let pendingWages = [];

    for (let i = 0; i < wages.length; i++) {
      if (wages[i].hired.establishment_id.equals(currentEstablishment._id)) {
        pendingWages.push(wages[i]);
      }
    }

    res.status(200).json({
      message: "pending Wages List fetched",
      success: true,
      pendingWages,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

exports.saveWages = async (req, res) => {
  try {
    const { user_id, basic, da, hra, other_allowance, leave_with_wages } =
      req.body;
    const currentUser = await userModel
      .findOne(
        { _id: user_id },
        {
          basic: 1,
          da: 1,
          hra: 1,
          other_allowance: 1,
          leave_with_wages: 1,
          wages_status: 1,
          hired: 1,
        }
      )
      .populate("hired");

    currentUser.basic = basic;
    currentUser.da = da;
    currentUser.hra = hra;
    currentUser.other_allowance = other_allowance;
    currentUser.leave_with_wages = leave_with_wages;
    currentUser.wages_status = true;

    currentUser.hired.basic = basic;
    currentUser.hired.da = da;
    currentUser.hired.hra = hra;
    currentUser.hired.other_allowance = other_allowance;
    currentUser.hired.leave_with_wages = leave_with_wages;
    currentUser.hired.wages_status = true;
    await currentUser.save();

    const wages = await userModel
      .find({ date_of_joining_status: true, wages_status: false })
      .populate("hired");

    const currentEstablishment = await adminModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    let pendingWages = [];

    for (let i = 0; i < wages.length; i++) {
      if (wages[i].hired.establishment_id.equals(currentEstablishment._id)) {
        pendingWages.push(wages[i]);
      }
    }

    res
      .status(200)
      .json({ success: true, message: "Wages Saved", pendingWages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getEmployeeDetail = async (req, res) => {
  const user = req.body;
  try {
    const currentUser = await userModel
      .findOne({ _id: user.userId })
      .populate("hired")
      .populate("qualifications")
      .populate("experiences");

    res
      .status(200)
      .json({ message: "user fetched", success: true, currentUser });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

exports.addUserPan = async (req, res) => {
  // const { full_name, pan_number} = req.body;
  const { userId, panInfo } = req.body;

  try {
    const currentUser = await userModel.findOne({ _id: userId });

    // if(currentUser.full_Name == full_name){
    currentUser.pan_number = panInfo.pan_number;
    currentUser.pan_name = panInfo.full_name;
    currentUser.pan_added = true;
    await currentUser.save();
    res.json({ message: "Pan Added", success: true });
    // }else{
    // res.json({message : "Name of Pan Card and Aadhar Card not matched", success : false});
    // }
  } catch (err) {
    res.json({ message: "error Occured", success: false });
  }
};

exports.getPendingPfEsic = async (req, res) => {
  try {
    const pfEsic = await userModel
      .find({ wages_status: true, pf_esic_status: false })
      .populate("hired");

    const currentEstablishment = await adminModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    let pendingPfEsic = [];

    for (let i = 0; i < pfEsic.length; i++) {
      if (pfEsic[i].hired.establishment_id.equals(currentEstablishment._id)) {
        pendingPfEsic.push(pfEsic[i]);
      }
    }
    res.status(200).json({
      message: "pending PF/ESIC List fetched",
      success: true,
      pendingPfEsic,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

exports.savePfEsic = async (req, res) => {
  try {
    const { user_id, uan_number, epf_number, esi_number } = req.body;
    const currentUser = await userModel
      .findOne(
        { _id: user_id },
        {
          uan_number: 1,
          epf_number: 1,
          esi_number: 1,
          pf_esic_status: 1,
          hired: 1,
          active_user_status: 1,
        }
      )
      .populate("hired");

    currentUser.uan_number = uan_number;
    currentUser.epf_number = epf_number;
    currentUser.esi_number = esi_number;
    currentUser.pf_esic_status = true;
    currentUser.active_user_status = true;

    currentUser.hired.uan_number = uan_number;
    currentUser.hired.epf_number = epf_number;
    currentUser.hired.esi_number = esi_number;
    currentUser.hired.pf_esic_status = true;
    currentUser.hired.active_user_status = true;
    await currentUser.save();

    const pfEsic = await userModel
      .find({ wages_status: true, pf_esic_status: false })
      .populate("hired");

    const currentEstablishment = await adminModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    let pendingPfEsic = [];

    for (let i = 0; i < pfEsic.length; i++) {
      if (pfEsic[i].hired.establishment_id.equals(currentEstablishment._id)) {
        pendingPfEsic.push(pfEsic[i]);
      }
    }

    res
      .status(200)
      .json({ success: true, message: "PF/ESIC Saved", pendingPfEsic });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.uploadFile1 = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel
      .findOne({ _id: userId }, { _id: 1, hired: 1, file1: 1 })
      .populate("hired");

    if (!user) return res.status(404).json({ msg: "User not found" });

    user.file1 = `/uploads/${req.file.filename}`; // Save the file path
    user.hired.file1 = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ msg: "file1 updated" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.uploadFile2 = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel
      .findOne({ _id: userId }, { _id: 1, file2: 1, hired: 1 })
      .populate("hired");

    if (!user) return res.status(404).json({ msg: "User not found" });

    user.file2 = `/uploads/${req.file.filename}`; // Save the file path
    user.hired.file2 = `/uploads/${req.file.filename}`;

    await user.save();

    res.json({ msg: "file2 updated" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    const establishment = await adminModel.findOneAndUpdate(
      { _id: req.user.id },
      { profilePic: `/uploads/${req.file.filename}` },
      { new: true, runValidators: false }
    );

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: "Establishment not found",
      });
    }

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      establishment,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile picture",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, contact, address, registration_number, gst_number } =
      req.body;

    // Check if email already exists for other establishments
    if (email !== req.user.email) {
      const existingEstablishment = await adminModel.findOne({
        email,
        _id: { $ne: req.user.id },
      });

      if (existingEstablishment) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    const establishment = await adminModel.findOneAndUpdate(
      { _id: req.user.id },
      {
        name,
        email,
        contact,
        address,
        registration_number,
        gst_number,
      },
      { new: true, runValidators: true }
    );

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: "Establishment not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      establishment,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

exports.uploadLogo = async (req, res) => {
  try {
    const establishment = await adminModel.findOneAndUpdate(
      { _id: req.user.id },
      { logo: `/uploads/${req.file.filename}` },
      { new: true, runValidators: false }
    );

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: "Establishment not found",
      });
    }

    res.json({
      success: true,
      message: "Logo updated successfully",
      establishment,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update logo",
      error: error.message,
    });
  }
};

exports.uploadSignature = async (req, res) => {
  try {
    // console.log('Upload request received:', req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No signature file provided",
      });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Delete old signature if exists
    if (admin.signature) {
      const oldPath = path.join(__dirname, "..", "uploads", admin.signature);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Store just the filename
    admin.signature = req.file.filename;
    await admin.save();

    res.json({
      success: true,
      message: "Signature uploaded successfully",
      signature: "/uploads/" + req.file.filename,
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

exports.deleteSignature = async (req, res) => {
  try {
    const establishment = await establishmentModel.findById(req.user.id);
    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: "Establishment not found",
      });
    }

    if (establishment.signature) {
      const signaturePath = path.join(
        __dirname,
        "..",
        "uploads",
        establishment.signature
      );
      if (fs.existsSync(signaturePath)) {
        fs.unlinkSync(signaturePath);
      }
      establishment.signature = null;
      await establishment.save();
    }

    res.json({
      success: true,
      message: "Signature deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting signature:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete signature",
    });
  }
};

exports.deleteLogo = async (req, res) => {
  try {
    const establishment = await adminModel.findOne({ _id: req.user.id });

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: "Establishment not found",
      });
    }

    // Delete the physical file if it exists
    if (establishment.logo) {
      const filePath = path.join(__dirname, "..", "public", establishment.logo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Update the establishment document using findOneAndUpdate
    const updatedEstablishment = await adminModel.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { logo: null } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Logo removed successfully",
      establishment: updatedEstablishment,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove logo",
      error: error.message,
    });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { registerData, panData } = req.body;
    const existingUser = await userModel.findOne({ email: registerData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        Message: "Email already exists as user",
      });
    }

    const existingAdmin = await adminModel.findOne({
      email: registerData.email,
    });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        Message: "Email already exists as establisment",
      });
    }

    const existingClient = await clientModel.findOne({
      email: registerData.email,
    });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        Message: "Email already exists as client",
      });
    }

    const existingSupervisor = await supervisorModel.findOne({
      email: registerData.email,
    });
    if (existingSupervisor) {
      return res.status(400).json({
        success: false,
        Message: "Email already exists as supervisor",
      });
    }

    const existingPan = await userModel.findOne({
      pan_number: registerData.pan_number,
    });
    if (existingPan) {
      return res.status(400).json({
        success: false,
        Message: "Pan already exists",
      });
    }

    let pass1 = registerData.fullName.slice(0, 4).toUpperCase(); // First 4 letters of fullName
    let pass2 = registerData.aadhar_no.slice(-4); // Last 4 digits of aadhar_no
    let newPassword = `${pass1}${pass2}`; // Combine both

    let hashedPassword;
    try {
      hashedPassword = await bcrpt.hash(newPassword, 10); // Corrected bcrypt spelling
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "nahi hua hash",
      });
    }

    const newUser = await userModel.create({
      full_Name: registerData.fullName,
      email: registerData.email,
      password: hashedPassword,
      contact: registerData.contact,
      aadhar_number: registerData.aadhar_no,
      country: panData.address.country,
      loc: panData.address.line_2,
      state: panData.address.state,
      street: panData.address.street_name,
      dob: registerData.dob,
      gender: panData.gender,
      zip: panData.address.zip,
      establisment: req.user.id,
      pan_number: registerData.pan_number,
      pan_name: panData.full_name,
      pan_added: true,
    });

    const users = await userModel.find({ establisment: req.user.id });

    return res.status(200).json({
      success: true,
      message: "user created successfully",
      users,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.find({ establisment: req.user.id });

    res
      .status(200)
      .json({ message: "User Data Fetched", success: true, users });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

exports.getLeaveRequests = async (req, res) => {
  try {
    // Fetch leave requests for the establishment
    const leaveRequests = await LeaveRequestModel.find({
      establishment_id: req.user.id,
      $or: [
        { status: { $in: ["Supervisor", "Approved"] } },
        {
          status: "Rejected",
          respondedByEstablishment: { $exists: true, $ne: null },
        },
      ],
    })
      .populate([
        {
          path: "user_id",
          select: "full_Name _id casualLeave earnedLeave medicalLeave",
        },
        {
          path: "supervisor_id",
          select: "name _id",
        },
      ])
      .sort({ createdAt: -1 });

    const establishment = await Admin.findById(req.user.id).select(
      "_id casualLeave earnedLeave medicalLeave"
    );
    res.status(200).json({
      success: true,
      message: "Leave requests fetched successfully",
      leaveRequests,
      establishment,
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching leave requests",
      error: error.message,
    });
  }
};

exports.allotLeave = async (req, res) => {
  try {
    const { casual, earned, medical } = req.body;

    // Validate input
    if (!casual && !earned && !medical) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one type of leave to allot",
      });
    }

    // Find the establishment
    const establishment = await Admin.findById(req.user.id).select(
      "casualLeave earnedLeave medicalLeave"
    );
    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: "Establishment not found",
      });
    }

    // Update leave balances
    if (casual) establishment.casualLeave = casual;
    if (earned) establishment.earnedLeave = earned;
    if (medical) establishment.medicalLeave = medical;

    await establishment.save();

    res.status(200).json({
      success: true,
      message: "Leave allotted successfully",
      establishment,
    });
  } catch (error) {
    console.error("Error allotting leave:", error);
    res.status(500).json({
      success: false,
      message: "Error allotting leave",
      error: error.message,
    });
  }
};

// Export the functions to be used in routes
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leaveRequestId = req.params.id;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide status",
      });
    }

    const leaveRequest = await LeaveRequestModel.findById(leaveRequestId)
      .select(
        "status respondedByEstablishment _id respondedAt updatedAt user_id leaveType from to"
      )
      .populate(
        "user_id",
        "full_Name _id leaveTaken leaveYear leaveHistory medicalLeaveHistory casualLeaveHistory earnedLeaveHistory casualLeave earnedLeave medicalLeave"
      );

    if (leaveRequest) {
      leaveRequest.respondedByEstablishment = req.user.id;
      leaveRequest.respondedAt = new Date();
      leaveRequest.status = status;
      leaveRequest.updatedAt = new Date();
      // leaveRequest.user_id.leaveTaken += 1; // Increment leave taken count

      if (leaveRequest.user_id.leaveYear < new Date().getFullYear()) {
        leaveRequest.user_id.casualLeaveHistory.push({
          year: leaveRequest.user_id.leaveYear,
          totalLeaves: leaveRequest.user_id.casualLeave,
        });
        leaveRequest.user_id.casualLeave = 0; // Reset casual leave for the new
        leaveRequest.user_id.earnedLeaveHistory.push({
          year: leaveRequest.user_id.leaveYear,
          totalLeaves: leaveRequest.user_id.earnedLeave,
        });
        leaveRequest.user_id.earnedLeave = 0; // Reset earned leave for the new year
        leaveRequest.user_id.medicalLeaveHistory.push({
          year: leaveRequest.user_id.leaveYear,
          totalLeaves: leaveRequest.user_id.medicalLeave,
        });
        leaveRequest.user_id.medicalLeave = 0; // Reset medical leave for the new year
        leaveRequest.user_id.leaveHistory.push({
          year: leaveRequest.user_id.leaveYear,
          totalLeaves: leaveRequest.user_id.leaveTaken,
        });
        leaveRequest.user_id.leaveTaken = 0; // Reset total leaves taken for the new year
        // Update the leave year to the current year
        leaveRequest.user_id.leaveYear = new Date().getFullYear();
      }

      if (status === "Approved") {
        // Calculate number of leave days (inclusive)
        const fromDate = new Date(leaveRequest.from);
        const toDate = new Date(leaveRequest.to);
        const timeDiff = toDate.getTime() - fromDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1; // inclusive of both days

        if (leaveRequest.leaveType === "Casual") {
          leaveRequest.user_id.casualLeave += dayDiff;
        } else if (leaveRequest.leaveType === "Earned") {
          leaveRequest.user_id.earnedLeave += dayDiff;
        } else if (leaveRequest.leaveType === "Medical") {
          leaveRequest.user_id.medicalLeave += dayDiff;
        }

        leaveRequest.user_id.leaveTaken += dayDiff;
      }
    }
    // Save the user leave data
    await leaveRequest.user_id.save();

    const updatedLeaveRequest = await leaveRequest.save();

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    const leaveRequests = await LeaveRequestModel.find({
      establishment_id: req.user.id,
    }).populate([
      {
        path: "user_id",
        select: "full_Name _id casualLeave earnedLeave medicalLeave",
      },
      {
        path: "supervisor_id",
        select: "name _id",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Leave request status updated successfully",
      updatedLeaveRequest,
      leaveRequests,
    });
  } catch (error) {
    console.error("Error updating leave request status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating leave request status",
      error: error.message,
    });
  }
};

exports.getAttendanceRecords = async (req, res) => {
  try {
    const establishmentId = req.user.id;

    const establishmentData = await adminModel
      .findById(establishmentId)
      .select("_id name email users")
      .populate({
        path: "users",
        options: { sort: { date: -1 } },
        select: "_id attendance full_Name hired email",
        populate: [
          {
            path: "attendance",
            select:
              "_id totalHours status checkInTime date checkOutTime lateByMinutes earlyCheckOutByMinutes",
          },
          {
            path: "hired",
            select: "hiring_id",
            populate: {
              path: "hiring_id",
              select: "job_category",
            },
          },
        ],
      });

    //   console.log(establishmentData);s

    // const leaveRequests = await Leave.find({ user_id : userId });

    res.status(200).json({
      success: true,
      message: "user data has fetched",
      establishmentData,
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

exports.getEmployeeAttendanceRecord = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const employeeData = await userModel
      .findById(employeeId)
      .select("_id attendance full_Name hired email")
      .populate([
        {
          path: "attendance",
          options: { sort: { date: -1 } },
          select:
            "_id totalHours status checkInTime date checkOutTime lateByMinutes earlyCheckOutByMinutes",
        },
        {
          path: "hired",
          select: "hiring_id",
          populate: {
            path: "hiring_id",
            select: "job_category",
          },
        },
      ]);

    res.status(200).json({
      success: true,
      message: "user data has fetched",
      employeeData,
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

exports.getHolidayData = async (req, res) => {
  try {
    const establishmentId = req.user.id;

    const establishmentData = await adminModel
      .findById(establishmentId)
      .select("_id name holiday_added holidays")
      .populate({
        path: "holidays",
        options: { sort: { date: -1 } },
      });

    if (!establishmentData.holiday_added) {
      const currentYear = new Date().getFullYear();

      // 🔹 Fetch national holidays
      const response = await axios.get(
        "https://calendarific.com/api/v2/holidays",
        {
          params: {
            api_key: process.env.CALENDARIFIC_API_KEY,
            country: "IN",
            year: currentYear,
            type: "national",
          },
        }
      );

      const holidays = response.data.response.holidays;
      const savedHolidayIds = [];

      // 🔹 Save national holidays
      for (const holiday of holidays) {
        if (!holiday.date || !holiday.date.iso) {
          console.warn("Skipping invalid holiday:", holiday);
          continue;
        }

        const holidayDate = new Date(holiday.date.iso);
        if (!isNaN(holidayDate)) {
          const existing = await holidayModel.findOne({
            date: holidayDate,
            establishment: establishmentId,
          });

          if (!existing) {
            const saved = await holidayModel.create({
              name: holiday.name,
              description: holiday.description,
              date: holidayDate,
              type: "official",
              country: holiday.country.name,
              location: holiday.locations,
              establishment: establishmentId,
            });
            savedHolidayIds.push(saved._id);
          } else {
            savedHolidayIds.push(existing._id);
          }
        }
      }

      // 🔹 Add all Sundays
      let date = new Date(`${currentYear}-01-01`);
      while (date.getFullYear() === currentYear) {
        if (date.getDay() === 0) {
          const existingSunday = await holidayModel.findOne({
            date,
            establishment: establishmentId,
          });

          if (!existingSunday) {
            const savedSunday = await holidayModel.create({
              name: "Sunday",
              description: "Weekly Off",
              date,
              type: "weekend",
              country: "India",
              location: "All",
              establishment: establishmentId,
            });
            savedHolidayIds.push(savedSunday._id);
          } else {
            savedHolidayIds.push(existingSunday._id);
          }
        }
        date.setDate(date.getDate() + 1);
      }

      // 🔹 Link holidays to the establishment
      establishmentData.holidays.push(...savedHolidayIds);
      establishmentData.holiday_added = true;
      await establishmentData.save();
    }

    res.status(200).json({
      success: true,
      message: "Holiday data has been fetched",
      establishmentData,
    });
  } catch (error) {
    console.error("Error fetching Holiday data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Holiday data",
      error: error.message,
    });
  }
};

exports.deleteHoliday = async (req, res) => {
  try {
    const result = await holidayModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Holiday not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Holiday deleted successfully" });
  } catch (error) {
    console.error("Error deleting holiday:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.addHoliday = async (req, res) => {
  const { name, type, date, description } = req.body;
  const establishment = req.user.id;

  if (!name || !type || !date) {
    return res.status(400).json({ success: false, message: "Missing fields." });
  }

  try {
    const newHoliday = await holidayModel.create({
      name,
      type,
      date: new Date(date),
      description,
      establishment,
    });

    await Admin.findByIdAndUpdate(establishment, {
      $push: { holidays: newHoliday._id },
    });

    res.status(201).json({ success: true, holiday: newHoliday });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getHolidays = async (req, res) => {
  try {
    const establishmentId = req.user.id;

    const establishment = await adminModel
      .findById(establishmentId)
      .select("_id name holidays")
      .populate({
        path: "holidays",
        select: "_id name date type establishment createdAt",
        options: { sort: { date: -1 } },
      });

    res.status(200).json({
      success: true,
      message: "Holidays have been fetched",
      holidays: establishment.holidays,
    });
  } catch (error) {
    console.error("Error fetching Holiday data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Holiday data",
      error: error.message,
    });
  }
};
