const LeaveRequestModel = require('../models/leave.model');
const supervisorModel = require('../models/supervisor.model');

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
      .select('status respondedBySupervisor _id respondedAt user_id leaveType')
      .populate('user_id', 'full_Name _id leaveTaken leaveYear leaveHistory medicalLeaveHistory casualLeaveHistory earnedLeaveHistory casualLeave earnedLeave medicalLeave');

    if (leaveRequest) {
      leaveRequest.respondedBySupervisor = req.user.id;
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

    const leaveRequests = await LeaveRequestModel.find({ supervisor_id: req.user.id })
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

const getLeaveRequests = async (req, res) => {
  try {
    // Fetch leave requests for the establishment
    const leaveRequests = await LeaveRequestModel.find({ supervisor_id: req.user.id })
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

    const supervisor = await supervisorModel.findById(req.user.id)
    .select('_id establisment')
    .populate('establisment', 'casualLeave earnedLeave medicalLeave');
    const establishment = supervisor.establisment;
    
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

module.exports = {
  updateLeaveStatus,
  getLeaveRequests
};