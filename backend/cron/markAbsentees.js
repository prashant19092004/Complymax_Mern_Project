const cron = require("node-cron");
const moment = require("moment-timezone");
const Attendance = require("../models/attendance.model.js");
const User = require("../models/user.js");
// const Holiday = require("../models/Holiday");
const Leave = require("../models/leave.model.js");

cron.schedule("59 23 * * *", async () => {
  const today = moment().tz("Asia/Kolkata").startOf("day").toDate();

//   const isHoliday = await Holiday.findOne({ date: today });
//   if (isHoliday) {
//     console.log("Today is a holiday. No absentees marked.");
//     return;
//   }

  const allUsers = await User.find({});

  for (const user of allUsers) {
    const hasAttendance = await Attendance.findOne({ user: user._id, date: today });
    if (hasAttendance) continue;

    const onLeave = await Leave.findOne({
      user_id: user._id,
      status: "Approved",
      from: { $lte: today },
      to: { $gte: today }
    });

    if (onLeave) {
      console.log(`${user.name} is on approved leave today`);
      continue;
    }

    await Attendance.create({
      user: user._id,
      date: today,
      status: "absent"
    });
  }

  console.log("Absent marked successfully for non-attendees.");
});
