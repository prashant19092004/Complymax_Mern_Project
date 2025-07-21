import React, { useState, useRef } from "react";
import "./AttendanceTable.css";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import * as XLSX from "xlsx";

const AttendanceTable = ({ users = [] }) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState(
    moment().tz("Asia/Kolkata").format("YYYY-MM-DD")
  );

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    return moment(timeStr).tz("Asia/Kolkata").format("hh:mm A");
  };


  const getStatus = (attendance, dateStr) => {
    const todayStr = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    if (!attendance) {
      return dateStr === todayStr ? "Absent" : "Holiday";
    }

    if (attendance.lateByMinutes > 0) return "Late";
    return attendance.status || "Present";
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const processedUsers = users?.map((user) => {
    const matchedAttendance = (user.attendance || []).find(
      (a) =>
        moment(a.date).tz("Asia/Kolkata").format("YYYY-MM-DD") === dateFilter
    );

    return {
      id: user._id,
      name: user.full_Name,
      initials: getInitials(user.full_Name),
      department: user.hired?.hiring_id?.job_category || "-",
      status: getStatus(matchedAttendance, dateFilter),
      checkIn: formatTime(matchedAttendance?.checkInTime),
      checkOut: formatTime(matchedAttendance?.checkOutTime),
      email: user.email,
    };
  });

  const filteredData = processedUsers?.filter((emp) => {
    const matchStatus =
      statusFilter === "All" ||
      emp.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch = emp.name
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleDownloadExcel = () => {
    const worksheetData = filteredData.map((emp) => ({
      Name: emp.name,
      Department: emp.department,
      Status: emp.status,
      "Check-In": emp.checkIn,
      "Check-Out": emp.checkOut,
      Email: emp.email,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    XLSX.writeFile(workbook, `Attendance_${dateFilter}.xlsx`);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Attendance</h3>
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
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            max={moment().format("YYYY-MM-DD")}
          />
          <button onClick={handleDownloadExcel} className="download-btn">
            Download Excel
          </button>
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
                onClick={() =>
                  navigate(`employee/${emp.id}`, {
                    state: {
                      employeeData: emp,
                    },
                  })
                }
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
