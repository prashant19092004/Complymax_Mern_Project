import React, { useState } from "react";
import "./AttendanceTable.css";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";

const AttendanceTable = ({ users = [] }) => {

  console.log(users);
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");

  // Helper to format time to IST (e.g. 09:15 AM)
  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    return moment(timeStr).tz("Asia/Kolkata").format("hh:mm A");
  };

  const getStatus = (attendance) => {
    if (!attendance) return "Absent";
    if (attendance.lateByMinutes > 0) return "Late";
    return attendance.status || "Present";
  };

  // Get today's date in YYYY-MM-DD format (for filtering)
  const todayDateStr = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

  const processedUsers = users?.map((user) => {
    const todayAttendance = (user.attendance || []).find((a) =>
      moment(a.date).tz("Asia/Kolkata").format("YYYY-MM-DD") === todayDateStr
    );

    return {
      id: user._id,
      name: user.full_Name,
      department: user.hired?.hiring_id?.job_category || "-",
      status: getStatus(todayAttendance),
      checkIn: formatTime(todayAttendance?.checkInTime),
      checkOut: formatTime(todayAttendance?.checkOutTime),
    };
  });

  const filteredData = processedUsers?.filter((emp) => {
    const matchStatus =
      statusFilter === "All" ||
      emp.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch =
      emp.name.toLowerCase().includes(searchText.trim().toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Today’s Attendance</h3>
        <div className="table-filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
            <option value="Late">Late</option>
          </select>
        </div>
      </div>

      <div className="table-scroll">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Status</th>
              <th>Check-In</th>
              <th>Check-Out</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((emp, index) => (
              <tr
                key={index}
                className="clickable-row"
                onClick={() => navigate(`employee/${emp.id}`)}
              >
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td className={`status ${emp.status.toLowerCase()}`}>
                  {emp.status}
                </td>
                <td>{emp.checkIn}</td>
                <td>{emp.checkOut}</td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" className="no-records">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
