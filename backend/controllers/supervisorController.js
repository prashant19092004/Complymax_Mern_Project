const LeaveRequestModel = require("../models/leave.model");
const supervisorModel = require("../models/supervisor.model");
const userModel = require("../models/user");
const adminModel = require("../models/admin");
const hiringModel = require("../models/hiring.model");
const hiredModel = require("../models/hired.model");

exports.getHirings = async (req, res) => {
  // console.log("getHirings called");
  try {
    currentSupervisor = await supervisorModel.findOne({ _id: req.user.id });

    const users = await userModel.find(
      {},
      { aadhar_number: 1, full_Name: 1, contact: 1 }
    );

    const currentEstablisment = await adminModel
      .findOne({ _id: currentSupervisor.establisment })
      .populate("hirings");
    // console.log("Current Supervisor:", currentSupervisor);

    const supervisorLocations = currentSupervisor.locations;
    const totalHirings = currentEstablisment.hirings;
    let requiredHirings = [];

    for (let i = 0; i < supervisorLocations.length; i++) {
      for (let j = 0; j < totalHirings.length; j++) {
        if (supervisorLocations[i].equals(totalHirings[j].location_id)) {
          requiredHirings.push(totalHirings[j]);
        }
      }
    }

    res.status(200).json({ success: true, requiredHirings, users });
  } catch (e) {
    res.status(500).json({ success: false, message: "Interna Server Error" });
  }
};

exports.hireUser = async (req, res) => {
  const { user_id, hiring_id } = req.body;
  try {
    const currentUser = await userModel.findOne(
      { _id: user_id },
      { _id: 1, hired: 1, job: 1, establisment: 1, employeeId: 1 }
    );

    if (currentUser.job) {
      return res
        .status(400)
        .json({ success: false, message: "user has already has a job" });
    }
    const currentSupervisor = await supervisorModel.findOne(
      { _id: req.user.id },
      { _id: 1, hired: 1, establisment: 1, locations: 1 }
    );

    const currentHiring = await hiringModel.findOne(
      { _id: hiring_id },
      { _id: 1, hired: 1, no_of_hired: 1 }
    );

    // Find the last hired user by employeeId in descending order
    const lastHired = await userModel.findOne().sort({ employeeId: -1 });
    let newEmployeeId = 1001; // Default starting employeeId

    // Increment the last user's ID if a user exists
    if (lastHired && lastHired.employeeId) {
      newEmployeeId = lastHired.employeeId + 1;
    }

    const newHired = await hiredModel.create({
      hiring_id,
      user_id,
      supervisor_id: req.user.id,
      establishment_id: currentSupervisor.establisment,
      employeeId: newEmployeeId,
    });

    currentUser.job = true;
    currentUser.hired = newHired._id;
    currentUser.employeeId = newEmployeeId;
    currentUser.establisment = currentSupervisor.establisment;
    currentUser.supervisor = currentSupervisor._id;
    await currentUser.save();

    const temp = currentHiring.no_of_hired;
    currentHiring.hired.push(newHired._id);
    currentHiring.no_of_hired = temp + 1;
    await currentHiring.save();

    currentSupervisor.hired.push(newHired._id);
    await currentSupervisor.save();

    const users = await userModel.find(
      {},
      { aadhar_number: 1, full_Name: 1, contact: 1 }
    );

    const currentEstablisment = await adminModel
      .findOne(
        { _id: currentSupervisor.establisment },
        { hirings: 1, users: 1, hireds: 1 }
      )
      .populate("hirings");

    currentEstablisment.hireds.push(newHired._id);
    currentEstablisment.users.push(user_id);
    await currentEstablisment.save();

    const supervisorLocations = currentSupervisor.locations;
    const totalHirings = currentEstablisment.hirings;
    let requiredHirings = [];

    for (let i = 0; i < supervisorLocations.length; i++) {
      for (let j = 0; j < totalHirings.length; j++) {
        if (supervisorLocations[i].equals(totalHirings[j].location_id)) {
          requiredHirings.push(totalHirings[j]);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Hired Successfully..",
      requiredHirings,
      users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getSupervisorDashboard = async (req, res) => {
  const currentUser = await supervisorModel.findOne({
    _id: req.user.id,
  });

  res.send(currentUser);
};

exports.getActiveUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({ active_user_status: true })
      .populate("hired");

    const currentSupervisor = await supervisorModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    let activeUsers = [];

    for (let i = 0; i < users.length; i++) {
      if (users[i].hired.supervisor_id.equals(currentSupervisor._id)) {
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

exports.assignDateOfJoining = async (req, res) => {
  try {
    const { dateOfJoining, chooseUser } = req.body;

    // Find the last hired user by employeeId in descending order
    const lastHired = await userModel.findOne().sort({ employeeId: -1 });
    let newEmployeeId = 1001; // Default starting employeeId

    // Increment the last user's ID if a user exists
    if (lastHired && lastHired.employeeId) {
      newEmployeeId = lastHired.employeeId + 1;
    }

    // Find the user to whom we are assigning the date of joining
    const currentUser = await userModel
      .findOne(
        { _id: chooseUser },
        { date_of_joining_status: 1, date_of_joining: 1, hired: 1 }
      )
      .populate("hired");

    if (!currentUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Assign date of joining and employee ID, then save
    currentUser.date_of_joining = dateOfJoining;
    currentUser.date_of_joining_status = true;
    // currentUser.employeeId = newEmployeeId;
    await currentUser.save();

    // Find all users who are hired but have not been assigned a date of joining
    const hiredList = await userModel
      .find({ job: true, date_of_joining_status: false })
      .populate("hired");

    // Find the current supervisor and get only their ID
    const currentSupervisor = await supervisorModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    let totalHired = [];

    // Filter hiredList for users supervised by the current supervisor
    if (currentSupervisor) {
      totalHired = hiredList.filter(
        (hiredUser) =>
          hiredUser.hired &&
          hiredUser.hired.supervisor_id.equals(currentSupervisor._id)
      );
    }

    // Return response with the updated list of hired users
    res
      .status(200)
      .json({ message: "Date of Joining Assigned", success: true, totalHired });
  } catch (error) {
    // Catch and return error message in case of any server error
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

exports.getHiredUsers = async (req, res) => {
  try {
    const hiredList = await userModel
      .find({ job: true, date_of_joining_status: false })
      .populate("hired");

    const currentSupervisor = await supervisorModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    let totalHired = [];

    for (let i = 0; i < hiredList.length; i++) {
      if (hiredList[i].hired.supervisor_id.equals(currentSupervisor._id)) {
        totalHired.push(hiredList[i]);
      }
    }

    res
      .status(200)
      .json({ message: "hired List fetched", success: true, totalHired });
  } catch (e) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

exports.getPendingWages = async (req, res) => {
  try {
    const wages = await userModel
      .find({ date_of_joining_status: true, wages_status: false })
      .populate("hired");

    const currentSupervisor = await supervisorModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    let pendingWages = [];

    for (let i = 0; i < wages.length; i++) {
      if (wages[i].hired.supervisor_id.equals(currentSupervisor._id)) {
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

    const currentSupervisor = await supervisorModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    let pendingWages = [];

    for (let i = 0; i < wages.length; i++) {
      if (wages[i].hired.supervisor_id.equals(currentSupervisor._id)) {
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

exports.getOfferLetters = async (req, res) => {
  try {
    const currentSupervisor = await supervisorModel.findOne({
      email: req.user.email,
    });
    if (!currentSupervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    const users = await userModel
      .find({
        active_user_status: true,
      })
      .populate("hired");

    const activeUsers = users.filter(
      (user) =>
        user.hired &&
        user.hired.establishment_id &&
        user.hired.establishment_id.equals(currentSupervisor.establisment)
    );

    res.status(200).json({
      success: true,
      employees: activeUsers,
      message: "Employees list fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
    });
  }
};

exports.getEmployeeDetails = async (req, res) => {
  try {
    const employee = await userModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    res.json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employee details",
    });
  }
};

exports.getEstablishmentProfile = async (req, res) => {
  try {
    const currentSupervisor = await supervisorModel.findById(req.user.id);
    const establishment = await establishmentModel
      .findById(currentSupervisor.establisment)
      .select("_id name email phone address logo signature");

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: "Establishment not found",
      });
    }

    // Make sure all required fields are included in the response
    res.status(200).json({
      success: true,
      data: {
        _id: establishment._id,
        name: establishment.name,
        email: establishment.email,
        phone: establishment.phone,
        address: establishment.address,
        logo: establishment.logo,
        signature: establishment.signature,
        // Add any other fields you need
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching establishment profile",
      error: error.message,
    });
  }
};

exports.getPendingPfEsic = async (req, res) => {
  try {
    const pfEsic = await userModel
      .find({ wages_status: true, pf_esic_status: false })
      .populate("hired");

    const currentSupervisor = await supervisorModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    let pendingPfEsic = [];

    for (let i = 0; i < pfEsic.length; i++) {
      if (pfEsic[i].hired.supervisor_id.equals(currentSupervisor._id)) {
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
    // Input validation
    const { user_id, uan_number, epf_number, esi_number } = req.body;

    if (!user_id || !uan_number || !epf_number || !esi_number) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (user_id, uan_number, epf_number, esi_number) are required",
      });
    }

    // Find and validate user
    const currentUser = await userModel
      .findOne({ _id: user_id })
      .populate("hired");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.hired) {
      return res.status(400).json({
        success: false,
        message: "User is not hired",
      });
    }

    // Update user data
    currentUser.uan_number = uan_number;
    currentUser.epf_number = epf_number;
    currentUser.esi_number = esi_number;
    currentUser.pf_esic_status = true;
    currentUser.active_user_status = true;

    // Update hired data
    currentUser.hired.uan_number = uan_number;
    currentUser.hired.epf_number = epf_number;
    currentUser.hired.esi_number = esi_number;
    currentUser.hired.pf_esic_status = true;
    currentUser.hired.active_user_status = true;

    // Save both documents
    await Promise.all([currentUser.save(), currentUser.hired.save()]);

    // Get pending PF/ESIC users for current supervisor
    const currentSupervisor = await supervisorModel.findOne(
      { _id: req.user.id },
      { _id: 1 }
    );
    if (!currentSupervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    const pfEsic = await userModel
      .find({
        wages_status: true,
        pf_esic_status: false,
      })
      .populate("hired");

    const pendingPfEsic = pfEsic.filter(
      (user) =>
        user.hired && user.hired.supervisor_id.equals(currentSupervisor._id)
    );

    res.status(200).json({
      success: true,
      message: "PF/ESIC details saved successfully",
      pendingPf_Esic: pendingPfEsic,
    });
  } catch (err) {
    console.error("Error in save-pf-esic:", err);
    res.status(500).json({
      success: false,
      message: err.message || "An error occurred while saving PF/ESIC details",
    });
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

exports.getSupervisorProfile = async (req, res) => {
  try {
    const currentSupervisor = await supervisorModel.findOne({
      _id: req.user.id,
    });

    res
      .status(200)
      .json({ message: "fetched", success: true, currentSupervisor });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

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
        "status respondedBySupervisor _id respondedAt user_id leaveType from to"
      )
      .populate(
        "user_id",
        "full_Name _id leaveTaken leaveYear leaveHistory medicalLeaveHistory casualLeaveHistory earnedLeaveHistory casualLeave earnedLeave medicalLeave"
      );

    if (leaveRequest) {
      leaveRequest.respondedBySupervisor = req.user.id;
      leaveRequest.respondedAt = new Date();
      leaveRequest.updatedAt = new Date();
      if (status === "Approved") {
        leaveRequest.status = "Supervisor";
      } else {
        leaveRequest.status = status;
      }

      // if (leaveRequest.user_id.leaveYear < new Date().getFullYear()) {
      //   leaveRequest.user_id.casualLeaveHistory.push({
      //     year: leaveRequest.user_id.leaveYear,
      //     totalLeaves: leaveRequest.user_id.casualLeave,
      //   });
      //   leaveRequest.user_id.casualLeave = 0; // Reset casual leave for the new
      //   leaveRequest.user_id.earnedLeaveHistory.push({
      //     year: leaveRequest.user_id.leaveYear,
      //     totalLeaves: leaveRequest.user_id.earnedLeave,
      //   });
      //   leaveRequest.user_id.earnedLeave = 0; // Reset earned leave for the new year
      //   leaveRequest.user_id.medicalLeaveHistory.push({
      //     year: leaveRequest.user_id.leaveYear,
      //     totalLeaves: leaveRequest.user_id.medicalLeave,
      //   });
      //   leaveRequest.user_id.medicalLeave = 0; // Reset medical leave for the new year
      //   leaveRequest.user_id.leaveHistory.push({
      //     year: leaveRequest.user_id.leaveYear,
      //     totalLeaves: leaveRequest.user_id.leaveTaken,
      //   });
      //   leaveRequest.user_id.leaveTaken = 0; // Reset total leaves taken for the new year
      //   // Update the leave year to the current year
      //   leaveRequest.user_id.leaveYear = new Date().getFullYear();
      // }

      // if (status === "Approved") {
      //   // Calculate number of leave days (inclusive)
      //   const fromDate = new Date(leaveRequest.from);
      //   const toDate = new Date(leaveRequest.to);
      //   const timeDiff = toDate.getTime() - fromDate.getTime();
      //   const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1; // inclusive of both days

      //   if (leaveRequest.leaveType === "Casual") {
      //     leaveRequest.user_id.casualLeave += dayDiff;
      //   } else if (leaveRequest.leaveType === "Earned") {
      //     leaveRequest.user_id.earnedLeave += dayDiff;
      //   } else if (leaveRequest.leaveType === "Medical") {
      //     leaveRequest.user_id.medicalLeave += dayDiff;
      //   }

      //   leaveRequest.user_id.leaveTaken += dayDiff;
      // }
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
      supervisor_id: req.user.id,
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

exports.getLeaveRequests = async (req, res) => {
  try {
    // Fetch leave requests for the establishment
    const leaveRequests = await LeaveRequestModel.find({
      supervisor_id: req.user.id,
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
      ]) // Populate employee details
      .sort({ createdAt: -1 }); // Sort by creation date, most recent first

    const supervisor = await supervisorModel
      .findById(req.user.id)
      .select("_id establisment")
      .populate("establisment", "casualLeave earnedLeave medicalLeave");
    const establishment = supervisor.establisment;

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

exports.addReportingLocation = async (req, res) => {
  try {
    const { latitude, longitude, areaName, reportingRadius } = req.body;

    if (!latitude || !longitude || !areaName || !reportingRadius) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide latitude, longitude, area name and reporting radius",
      });
    }

    // Assuming you have a Supervisor model to save the reporting location
    const supervisor = await supervisorModel.findById(req.user.id);
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    supervisor.reportingLocation = {
      latitude,
      longitude,
      areaName,
      reportingRadius,
    };

    await supervisor.save();
    // console.log('Reporting location added:', supervisor);

    res.status(200).json({
      success: true,
      message: "Reporting location added successfully",
      supervisor,
    });
  } catch (error) {
    console.error("Error adding reporting location:", error);
    res.status(500).json({
      success: false,
      message: "Error adding reporting location",
      error: error.message,
    });
  }
};

exports.saveCheckInCheckOut = async (req, res) => {
  try {
    const supervisorId = req.user.id; // assuming JWT middleware sets req.user
    const { checkInTime, checkOutTime } = req.body;

    if (!checkInTime || !checkOutTime) {
      return res
        .status(400)
        .json({ success: false, message: "Both times are required" });
    }

    const supervisor = await supervisorModel.findByIdAndUpdate(
      supervisorId,
      {
        checkInTime,
        checkOutTime,
      },
      { new: true }
    );

    if (!supervisor) {
      return res
        .status(404)
        .json({ success: false, message: "Supervisor not found" });
    }

    res.json({
      success: true,
      message: "Check-in and check-out time saved",
      supervisor,
    });
  } catch (error) {
    console.error("Error saving times:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
