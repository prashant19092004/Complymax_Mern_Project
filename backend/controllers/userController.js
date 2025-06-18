const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Leave = require('../models/leave.model');
const establishmentModel = require('../models/admin');
const supervisorModel = require('../models/supervisor.model');
const clientModel = require('../models/client.model');

// Upload signature
exports.uploadSignature = async (req, res) => {
  try {
    // console.log('Upload request received:', req.file);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No signature file provided' 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Delete old signature if exists
    if (user.signature) {
      const oldPath = path.join(__dirname, '..', 'uploads', user.signature);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Store just the filename with /uploads prefix
    user.signature = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      message: 'Signature uploaded successfully',
      user: {
        ...user.toObject(),
        signature: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error uploading signature'
    });
  }
};

// Delete signature
exports.deleteSignature = async (req, res) => {
  try {
    // console.log('Delete request received for user:', req.user.id);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.signature) {
      const signaturePath = path.join(__dirname, '..', 'uploads', user.signature.replace('/uploads/', ''));
      // console.log('Attempting to delete file at:', signaturePath);
      
      try {
        if (fs.existsSync(signaturePath)) {
          fs.unlinkSync(signaturePath);
          // console.log('File deleted successfully');
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue even if file deletion fails
      }

      // Update database
      user.signature = '';
      await user.save();
      // console.log('Database updated successfully');

      res.json({ 
        success: true, 
        message: 'Signature deleted successfully',
        user: user.toObject()
      });
    } else {
      res.json({ 
        success: true, 
        message: 'No signature found to delete',
        user: user.toObject()
      });
    }
  } catch (error) {
    console.error('Error in deleteSignature:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting signature',
      error: error.message 
    });
  }
};

exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, reason, from, to } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user

    const leave = new Leave({
      user_id: userId,
      leaveType,
      reason,
      from,
      to,
      status: 'Pending',
      // Add other fields as needed
    });

    await leave.save();

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      leave
    });
  } catch (error) {
    console.error('Error applying leave:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting leave request',
      error: error.message
    });
  }
};

exports.leavePageData = async (req, res) => {
  try{
    const userId = req.user.id;

    const userData = await User.findById(userId)
      .select("full_Name email establisment hired leaveTaken casualLeave annualLeave medicalLeave")
      .populate([
        {
          path: "hired",
          select: "hiring_id supervisor_id",
          populate: [
            {
            path: "hiring_id",
            select: "client_id job_category"
            },
            {
              path: "supervisor_id",
              select: "name _id"
            }
          ]
        },
        {
          path: "establisment",
          select: "casualLeave medicalLeave annualLeave"
        }
    ])

    const leaveRequests = await Leave.find({ user_id : userId });

      res.status(200).json({
        success: true,
        message: "user data has fetched",
        userData,
        leaveRequests
      });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
}

exports.leaveApplication = async (req, res) => {
  try {
    const { establishment_id, supervisor_id, client_id, reportingManager, leaveType, reason, from, to } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user

    const leave = new Leave({
      establishment_id,
      supervisor_id,
      client_id,
      user_id: userId,
      reportingManager,
      leaveType,
      reason,
      from,
      to,
      status: 'Pending',
      // Add other fields as needed
    });

    await leave.save();

    const establishment = await establishmentModel.findById(establishment_id)
      .select("leaveRequests");

    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: 'Establishment not found'
      });
    }
    // Add the leave request to the establishment's leaveRequests array
    establishment.leaveRequests.push(leave._id);
    await establishment.save();

    const user = await User.findById(userId)
      .select("leaveRequests");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    // Add the leave request to the user's leaveRequests array
    user.leaveRequests.push(leave._id);
    await user.save();  

    const supervisor = await supervisorModel.findById(supervisor_id)
      .select("leaveRequests");
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found'
      });
    }
    // Add the leave request to the supervisor's leaveRequests array
    supervisor.leaveRequests.push(leave._id);
    await supervisor.save();

    const client = await clientModel.findById(client_id)
      .select("leaveRequests");
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Add the leave request to the client's leaveRequests array
    client.leaveRequests.push(leave._id);
    await client.save();


    // Fetch all leave requests for the user to return in the response
    const leaveRequests = await Leave.find({ user_id : userId });


    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      leave,
      leaveRequests,
    });
  } catch (error) {
    console.error('Error applying leave:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting leave request',
      error: error.message
    });
  }
};