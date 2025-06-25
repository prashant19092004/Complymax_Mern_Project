const Admin = require('../models/admin');
const fs = require('fs');
const path = require('path');
const LeaveRequestModel = require('../models/leave.model');

const uploadSignature = async (req, res) => {
  try {
    // console.log('Upload request received:', req.file);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No signature file provided' 
      });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    // Delete old signature if exists
    if (admin.signature) {
      const oldPath = path.join(__dirname, '..', 'uploads', admin.signature);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Store just the filename
    admin.signature = req.file.filename;
    await admin.save();

    res.json({
      success: true,
      message: 'Signature uploaded successfully',
      signature: '/uploads/' + req.file.filename
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

const deleteSignature = async (req, res) => {
  try {
    // console.log('Delete request received for user:', req.user.id);

    // Find the establishment
    const establishment = await Admin.findById(req.user.id);
    if (!establishment) {
      // console.log('Establishment not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Establishment not found' 
      });
    }

    if (establishment.signature) {
      const signaturePath = path.join(__dirname, '..', 'uploads', establishment.signature);
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
      establishment.signature = null;
      await establishment.save();
      // console.log('Database updated successfully');

      res.json({ 
        success: true, 
        message: 'Signature deleted successfully' 
      });
    } else {
      res.json({ 
        success: true, 
        message: 'No signature found to delete' 
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

const getLeaveRequests = async (req, res) => {
  try {
    // Fetch leave requests for the establishment
    const leaveRequests = await LeaveRequestModel.find({ establishment_id: req.user.id })
      .populate([
        {
        path: 'user_id',
        select: 'full_Name _id casualLeave earnedLeave medicalLeave'
      },
      {
        path: 'supervisor_id',
        select: 'name _id'
      }
    ]) // Populate employee details
      .sort({ createdAt: -1 }); // Sort by creation date, most recent first

    const establishment = await Admin.findById(req.user.id)
    .select('_id casualLeave earnedLeave medicalLeave');
    res.status(200).json({
      success: true,
      message: 'Leave requests fetched successfully',
      leaveRequests,
      establishment
    });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leave requests',
      error: error.message
    });
  }
};

const allotLeave = async (req, res) => {
  try {
    const { casual, earned, medical } = req.body;

    // Validate input
    if (!casual && !earned && !medical) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one type of leave to allot'
      });
    }

    // Find the establishment
    const establishment = await Admin.findById(req.user.id)
      .select('casualLeave earnedLeave medicalLeave');
    if (!establishment) {
      return res.status(404).json({
        success: false,
        message: 'Establishment not found'
      });
    }

    // Update leave balances
    if (casual) establishment.casualLeave = casual;
    if (earned) establishment.earnedLeave = earned;
    if (medical) establishment.medicalLeave = medical;

    await establishment.save();

    res.status(200).json({
      success: true,
      message: 'Leave allotted successfully',
      establishment
    });
  } catch (error) {
    console.error('Error allotting leave:', error);
    res.status(500).json({
      success: false,
      message: 'Error allotting leave',
      error: error.message
    });
  }
};

// Export the functions to be used in routes
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leaveRequestId = req.params.id;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const leaveRequest = await LeaveRequestModel.findById(leaveRequestId)
      .select('status respondedByEstablishment _id respondedAt user_id leaveType')
      .populate('user_id', 'full_Name _id leaveTaken leaveYear leaveHistory medicalLeaveHistory casualLeaveHistory earnedLeaveHistory casualLeave earnedLeave medicalLeave');

    if (leaveRequest) {
      leaveRequest.respondedByEstablishment = req.user.id;
      leaveRequest.respondedAt = new Date();
      leaveRequest.status = status;
      leaveRequest.updatedAt = new Date();
      // leaveRequest.user_id.leaveTaken += 1; // Increment leave taken count
      
      
      if(leaveRequest.user_id.leaveYear < new Date().getFullYear()) {
          leaveRequest.user_id.casualLeaveHistory.push({
            year: leaveRequest.user_id.leaveYear,
            totalLeaves: leaveRequest.user_id.casualLeave
          });
          leaveRequest.user_id.casualLeave = 0; // Reset casual leave for the new
          leaveRequest.user_id.earnedLeaveHistory.push({
            year: leaveRequest.user_id.leaveYear,
            totalLeaves: leaveRequest.user_id.earnedLeave
          });
          leaveRequest.user_id.earnedLeave = 0; // Reset earned leave for the new year
          leaveRequest.user_id.medicalLeaveHistory.push({
            year: leaveRequest.user_id.leaveYear,
            totalLeaves: leaveRequest.user_id.medicalLeave
          });
          leaveRequest.user_id.medicalLeave = 0; // Reset medical leave for the new year
          leaveRequest.user_id.leaveHistory.push({
            year: leaveRequest.user_id.leaveYear,
            totalLeaves: leaveRequest.user_id.leaveTaken
          });
          leaveRequest.user_id.leaveTaken = 0; // Reset total leaves taken for the new year
          // Update the leave year to the current year
          leaveRequest.user_id.leaveYear = new Date().getFullYear();
        }


      if(status === 'Approved') {
        // Increment the appropriate leave type based on the leaveType field
        if (leaveRequest.leaveType === 'Casual') {
          leaveRequest.user_id.casualLeave += 1;
          leaveRequest.user_id.leaveTaken += 1; // Increment total leaves taken
        } else if (leaveRequest.leaveType === 'Earned') {
          leaveRequest.user_id.earnedLeave += 1;
          leaveRequest.user_id.leaveTaken += 1; // Increment total leaves taken
        } else if (leaveRequest.leaveType === 'Medical') {
          leaveRequest.user_id.medicalLeave += 1;
          leaveRequest.user_id.leaveTaken += 1; // Increment total leaves taken
        }
      }
    }
    // Save the user leave data
    await leaveRequest.user_id.save();
    
    const updatedLeaveRequest = await leaveRequest.save();

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    const leaveRequests = await LeaveRequestModel.find({ establishment_id: req.user.id })
      .populate([
        {
          path: 'user_id',
          select: 'full_Name _id casualLeave earnedLeave medicalLeave'
        },
        {
          path: 'supervisor_id',
          select: 'name _id'
        }
      ]);

    res.status(200).json({
      success: true,
      message: 'Leave request status updated successfully',
      updatedLeaveRequest,
      leaveRequests
    });
  } catch (error) {
    console.error('Error updating leave request status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating leave request status',
      error: error.message
    });
  }
};

module.exports = {
  uploadSignature,
  deleteSignature,
  getLeaveRequests,
  allotLeave,
  updateLeaveStatus
};