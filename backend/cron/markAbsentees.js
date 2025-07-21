const cron = require("node-cron");
const moment = require("moment-timezone");
const Attendance = require("../models/attendance.model.js");
const User = require("../models/user.js");
const holidayModel = require("../models/holiday.model.js");
const Leave = require("../models/leave.model.js");
const AdminModel = require("../models/admin.js");
const SupervisorModel = require("../models/supervisor.model.js");
const ClientModel = require("../models/client.model.js");
const HiredModel = require("../models/hired.model.js");


cron.schedule("59 23 * * *", async () => {
  try {
  const todayStart = moment().tz("Asia/Kolkata").startOf("day").toDate();
  const todayEnd = moment().tz("Asia/Kolkata").endOf("day").toDate();

  const allUsers = await User.find({ hired: { $ne: null } })
    .select("_id full_Name email hired")
    .populate({
      path: "hired",
      select: "_id hiring_id supervisor_id establishment_id",
      populate: {
        path: "hiring_id",
        select: "_id client_id",
      },
    });

  await Promise.all(
    allUsers.map(async (user) => {
      const isHoliday = await holidayModel.findOne({
        date: { $gte: todayStart, $lte: todayEnd },
        establishment: user.hired.establishment_id,
      });

      if (isHoliday) {
        console.log(
          `${user.full_Name} skipped (holiday for establishment ${user.hired.establishment_id})`
        );
        return;
      }

      const hasAttendance = await Attendance.findOne({
        user: user._id,
        date: {
          $gte: todayStart,
          $lte: todayEnd,
        },
      });

      if (hasAttendance) return;

      const leave = await Leave.findOne({
        user_id: user._id,
        status: "Approved",
        from: { $lte: todayEnd },
        to: { $gte: todayStart },
      });

      let attendance = null;
      let status = "Absent";

      if (leave) {
        if (leave.leaveSubType === "First Half") status = "First Half Leave";
        else if (leave.leaveSubType === "Second Half") status = "Second Half Leave";
        else status = "Leave";
      }

      attendance = await Attendance.create({
        user: user._id,
        hiredId: user.hired._id,
        establishment: user.hired.establishment_id,
        client: user.hired.hiring_id.client_id,
        supervisor: user.hired.supervisor_id,
        date: todayStart,
        status,
      });

      console.log(`${user.full_Name} marked as ${status}`);

      // ✅ Save attendance._id in related models
      const updates = [
        { model: AdminModel, id: user.hired.establishment_id },
        { model: SupervisorModel, id: user.hired.supervisor_id },
        { model: ClientModel, id: user.hired.hiring_id.client_id },
        { model: User, id: user._id },
        { model: HiredModel, id: user.hired._id },
      ];

      for (const { model, id } of updates) {
        const doc = await model.findById(id);
        if (doc) {
          doc.attendance = doc.attendance || [];
          doc.attendance.push(attendance._id);
          await doc.save();
        }
      }
    })
  );

  // Handle check-in without check-out → mark as absent
  const partials = await Attendance.find({
    date: { $gte: todayStart, $lte: todayEnd },
    checkIn: { $ne: null },
    checkOut: null,
    status: { $ne: "Absent" },
  });

  for (const record of partials) {
    record.status = "Absent";
    await record.save();

    // const user = await User.findById(record.user);
    // console.log(`${user?.full_Name || "User"} marked as absent (no check-out)`);
  }

  console.log("Attendance marking completed for today.");
} catch (error) {
  console.error("Error in attendance cron job:", error);
}

});
