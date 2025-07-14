const cron = require("node-cron");
const moment = require("moment-timezone");
const Attendance = require("../models/attendance.model.js");
const User = require("../models/user.js");
const holidayModel = require("../models/holiday.model.js");
const Leave = require("../models/leave.model.js");

cron.schedule("59 23 * * *", async () => {
  try {
    const todayStart = moment().tz("Asia/Kolkata").startOf("day").toDate();
    const todayEnd = moment().tz("Asia/Kolkata").endOf("day").toDate();

    // 1. Check for holiday
    const isHoliday = await holidayModel.findOne({
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    if (isHoliday) {
      console.log("Today is a holiday. No absentees marked.");
      return;
    }

    const allUsers = await User.find({});

    // 2. Loop through all users
    await Promise.all(
      allUsers.map(async (user) => {
        // Check if attendance already exists
        const hasAttendance = await Attendance.findOne({
          user: user._id,
          date: {
            $gte: todayStart,
            $lte: todayEnd,
          },
        });

        if (hasAttendance) return;

        // Check for approved leave
        const leave = await Leave.findOne({
          user_id: user._id,
          status: "Approved",
          from: { $lte: todayEnd },
          to: { $gte: todayStart },
        });

        if (leave) {

          let status = "Leave";
          if (leave.leaveSubType === "First Half") {
            status = "First Half Leave";
          }

          if (leave.leaveSubType === "Second Half") {
            status = "Second Half Leave";
          }

          await Attendance.create({
            user: user._id,
            date: todayStart,
            status,
          });

          console.log(`${user.name} marked as ${status}`);
          return;
        }

        // No leave, no attendance → mark as absent
        await Attendance.create({
          user: user._id,
          date: todayStart,
          status: "absent",
        });

        console.log(`${user.name} marked as absent (no attendance record)`);
      })
    );

    // 3. Handle check-in without check-out → mark as absent
    const partials = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd },
      checkIn: { $ne: null },
      checkOut: null,
      status: { $ne: "absent" },
    });

    for (const record of partials) {
      record.status = "absent";
      await record.save();

      const user = await User.findById(record.user);
      console.log(`${user?.name || "User"} marked as absent (no check-out)`);
    }

    console.log("Attendance marking completed for today.");
  } catch (error) {
    console.error("Error in attendance cron job:", error);
  }
});
