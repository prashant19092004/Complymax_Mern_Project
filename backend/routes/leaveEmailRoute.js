const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const LeaveRequestModel = require("../models/leave.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


function formatDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}


const generateLeaveActionLink = ({ leaveId, role, action, responderId }) => {
  const token = jwt.sign({ leaveId, role, action }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
  return `${process.env.BASE_URL}/api/leave-action?leaveId=${leaveId}&role=${role}&action=${action}&responderId=${responderId}&token=${token}`;
};

function getLeaveStatusEmailHTML({ employeeName, status, leaveType, fromDate, toDate, respondedBy, companyName }) {
  const statusText = status === "Approved" ? "Approved ✅" : "Rejected ❌";
  const statusColor = status === "Approved" ? "#28a745" : "#dc3545";
  const statusIcon = status === "Approved" ? "✔️" : "❌";

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Leave ${status}</title>
    </head>
    <body style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; margin: 0; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="background-color: ${statusColor}; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Leave Request ${statusText}</h2>
        </div>

        <div style="padding: 30px; color: #333;">
          <p>Hi <strong>${employeeName}</strong>,</p>

          <p>Your <strong>${leaveType}</strong> leave request from <strong>${fromDate}</strong> to <strong>${toDate}</strong> has been <strong style="color: ${statusColor};">${status}</strong>.</p>

          <p>This action was taken by <strong>${respondedBy}</strong>.</p>

          <p style="margin-top: 30px;">If you have any questions or believe this was done in error, please contact your Reporting Manager.</p>

          <p style="margin-top: 40px;">Regards,<br/>${companyName}</p>
        </div>

        <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 13px; color: #777;">
          © ${new Date().getFullYear()} Complymax Management Pvt. Ltd.. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
}


// Utility to send email
const sendEmail = async ({from, to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};

router.get("/leave-action", async (req, res) => {
  try {
    const { role, action, leaveId, responderId, token } = req.query;

    // Validate inputs
    if (!role || !action || !leaveId || !token) {
      return res
        .status(400)
        .send("<h3>Missing required query parameters.</h3>");
    }

    // Verify token authenticity
    const isValid = verifyToken(token, leaveId);
    if (!isValid) {
      return res.status(401).send("<h3>Unauthorized or expired link.</h3>");
    }

    // Find the leave request
    const leave = await LeaveRequestModel.findById(leaveId)
      .select(
        "status supervisor_id respondedByEstablishment _id respondedAt updatedAt user_id leaveType from to establishment_id reason leaveSubType"
      )
      .populate([
        {
          path: "user_id",
          select:
            "full_Name email _id leaveTaken leaveYear leaveHistory medicalLeaveHistory casualLeaveHistory earnedLeaveHistory casualLeave earnedLeave medicalLeave",
        },
        {
          path: "establishment_id",
          select: "_id name email casualLeave earnedLeave medicalLeave",
        },
        {
          path: "supervisor_id",
          select: "_id name"
        }
      ]);
    if (!leave) {
      return res.status(404).send("<h3>Leave request not found.</h3>");
    }

    const formatFrom = formatDate(leave.from);
    const formatTo = formatDate(leave.to);
    

    // Update leave status based on action and role
    // if (action === "approve") {
    //   leave.status = role === "supervisor" ? "Supervisor" : "Approved";
    // } else if (action === "reject") {
    //   leave.status =
    //     role === "supervisor" ? "Rejected" : "Rejected by Establishment";
    // } else {
    //   return res
    //     .status(400)
    //     .send("<h3>Invalid action. Must be 'approve' or 'reject'.</h3>");
    // }

    if (role === "supervisor") {
      if (leave.status != "Pending") {
        return res.send(`
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; text-align: center;">
        <h2 style="color: ${
          leave.status === "Superviosr" ? "#28a745" : "#dc3545"
        };">
          Leave Already ${
            leave.status === "Supervisor" ? "Approved" : "Rejected"
          }
        </h2>
      </div>
    `);
      }
      leave.respondedBySupervisor = responderId;
      leave.respondedAt = new Date();
      leave.updatedAt = new Date();
      if (action == "approve") {
        leave.status = "Supervisor";

        // ✅ Send Email to Supervisor
        const approveLink = generateLeaveActionLink({
          leaveId: leave._id,
          role: "Establishment",
          action: "approve",
          responderId: leave.establishment_id._id,
        });
        const rejectLink = generateLeaveActionLink({
          leaveId: leave._id,
          role: "Establishment",
          action: "reject",
          responderId: leave.establishment_id._id,
        });

        const remainingEarnedLeave =
          leave.establishment_id.earnedLeave - leave.user_id.earnedLeave;
        const remainingMedicalLeave =
          leave.establishment_id.medicalLeave - leave.user_id.medicalLeave;
        const remainingCasualLeave =
          leave.establishment_id.casualLeave - leave.user_id.casualLeave;

        const emailHTML = `
  <div style="max-width: 600px; margin: auto; background: #fff; padding: 16px; border-radius: 8px; font-family: Arial, sans-serif; font-size: 14px;">
    <h2 style="color: #333; font-size: 18px; margin-bottom: 12px;">Leave Request Approval Needed</h2>
    <p style="margin: 6px 0;"><strong>${leave.user_id.full_Name}</strong> has submitted a leave request:</p>
    
    <ul style="line-height: 1.4; padding-left: 16px; margin: 8px 0;">
      <li><strong>From:</strong> ${formatFrom}</li>
      <li><strong>To:</strong> ${formatTo}</li>
      <li><strong>Type:</strong> ${leave.leaveType} - ${leave.leaveSubType}</li>
      <li><strong>Reason:</strong> ${leave.reason}</li>
    </ul>

    <h3 style="margin: 16px 0 8px; font-size: 16px; color: #333;">Remaining Leave Balance</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ddd;">Leave Type</th>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ddd;">Remaining</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 6px; border-bottom: 1px solid #eee;">Earned Leave</td>
          <td style="padding: 6px; border-bottom: 1px solid #eee;">${remainingEarnedLeave}</td>
        </tr>
        <tr>
          <td style="padding: 6px; border-bottom: 1px solid #eee;">Medical Leave</td>
          <td style="padding: 6px; border-bottom: 1px solid #eee;">${remainingMedicalLeave}</td>
        </tr>
        <tr>
          <td style="padding: 6px;">Casual Leave</td>
          <td style="padding: 6px;">${remainingCasualLeave}</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top: 16px; margin-bottom: 6px;">Please take an action:</p>
    <div style="margin-top: 12px; text-align: center;">
      <a href="${approveLink}" style="background: #28a745; color: white; padding: 8px 14px; text-decoration: none; border-radius: 4px; margin-right: 6px;">Accept</a>
      <a href="${rejectLink}" style="background: #dc3545; color: white; padding: 8px 14px; text-decoration: none; border-radius: 4px;">Reject</a>
    </div>

    <p style="margin-top: 20px;">Regards,<br/>Leave Management System</p>
  </div>
`;

        await sendEmail({
          to: leave.establishment_id.email,
          subject: "Leave Request from " + leave.user_id.full_Name,
          html: emailHTML,
        });
      } else {
        leave.status = "Rejected";

        const emailHTML = getLeaveStatusEmailHTML({employeeName : leave.user_id.full_Name, status : "Rejected", leaveType: leave.leaveType, fromDate: formatFrom, toDate: formatTo, respondedBy: "Reporting Manager", companyName: leave.establishment_id.name});

        await sendEmail({
          from: leave.establishment_id.name,
          to: leave.user_id.email,
          subject: "Leave Response from " + leave.supervisor_id.name,
          html: emailHTML,
        });

      }
    } else {
      if (leave.status != "Supervisor") {
        return res.send(`
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; text-align: center;">
        <h2 style="color: ${
          leave.status === "Approved" ? "#28a745" : "#dc3545"
        };">
          Leave Already ${leave.status === "Rejected" ? "Approved" : "Rejected"}
        </h2>
      </div>
    `);
      }
      leave.respondedByEstablishment = responderId;
      leave.respondedAt = new Date();
      if (action == "approve") {
        leave.status = "Approved";

        if (leave.user_id.leaveYear < new Date().getFullYear()) {
          leave.user_id.casualLeaveHistory.push({
            year: leave.user_id.leaveYear,
            totalLeaves: leave.user_id.casualLeave,
          });
          leave.user_id.casualLeave = 0; // Reset casual leave for the new
          leave.user_id.earnedLeaveHistory.push({
            year: leave.user_id.leaveYear,
            totalLeaves: leave.user_id.earnedLeave,
          });
          leave.user_id.earnedLeave = 0; // Reset earned leave for the new year
          leave.user_id.medicalLeaveHistory.push({
            year: leave.user_id.leaveYear,
            totalLeaves: leave.user_id.medicalLeave,
          });
          leave.user_id.medicalLeave = 0; // Reset medical leave for the new year
          leave.user_id.leaveHistory.push({
            year: leaveRequest.user_id.leaveYear,
            totalLeaves: leaveRequest.user_id.leaveTaken,
          });
          leave.user_id.leaveTaken = 0; // Reset total leaves taken for the new year
          // Update the leave year to the current year
          leave.user_id.leaveYear = new Date().getFullYear();
        }

        // Calculate number of leave days (inclusive)
        const fromDate = new Date(leave.from);
        const toDate = new Date(leave.to);
        const timeDiff = toDate.getTime() - fromDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1; // inclusive of both days

        if (leave.leaveType === "Casual") {
          leave.user_id.casualLeave += dayDiff;
        } else if (leave.leaveType === "Earned") {
          leave.user_id.earnedLeave += dayDiff;
        } else if (leave.leaveType === "Medical") {
          leave.user_id.medicalLeave += dayDiff;
        }

        leave.user_id.leaveTaken += dayDiff;

        const emailHTML = getLeaveStatusEmailHTML({employeeName : leave.user_id.full_Name, status : "Approved", leaveType: leave.leaveType, fromDate: formatFrom, toDate: formatTo, respondedBy: "HOD", companyName: leave.establishment_id.name});

        await sendEmail({
          from: leave.establishment_id.name,
          to: leave.user_id.email,
          subject: "Leave Response from " + leave.establishment_id.name,
          html: emailHTML,
        });
      } else {
        leave.status = "Rejected";

        const emailHTML = getLeaveStatusEmailHTML({employeeName : leave.user_id.full_Name, status : "Rejected", leaveType: leave.leaveType, fromDate: formatFrom, toDate: formatTo, respondedBy: "HOD", companyName: leave.establishment_id.name});

        await sendEmail({
          from: leave.establishment_id.name,
          to: leave.user_id.email,
          subject: "Leave Response from " + leave.establishment_id.name,
          html: emailHTML,
        });
      }
      leave.updatedAt = new Date();
      // leaveRequest.user_id.leaveTaken += 1; // Increment leave taken count
    }

    await leave.user_id.save();
    await leave.save();

    // Optional: Send notifications here
    // await sendEmail(...);

    // Send success HTML response
    return res.send(`
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; text-align: center;">
        <h2 style="color: ${action === "approve" ? "#28a745" : "#dc3545"};">
          Leave ${action === "approve" ? "Approved" : "Rejected"} Successfully
        </h2>
        <p>Thank you for taking action.</p>
      </div>
    `);
  } catch (error) {
    console.error("Leave action error:", error);
    return res
      .status(500)
      .send("<h3>Internal Server Error. Please try again later.</h3>");
  }
});

module.exports = router;
