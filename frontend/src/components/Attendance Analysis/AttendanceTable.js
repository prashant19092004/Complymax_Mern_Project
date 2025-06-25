import React, { useState } from "react";
import "./AttendanceTable.css";
import { useNavigate } from "react-router-dom";

const fullData = [
  {
    id: 1,
    name: "Aarav Sharma",
    department: "Sales",
    status: "Present",
    checkIn: "09:05 AM",
    checkOut: "06:01 PM",
  },
  {
    id: 2,
    name: "Isha Mehta",
    department: "HR",
    status: "Leave",
    checkIn: "-",
    checkOut: "-",
  },
  {
    id: 3,
    name: "Raj Patel",
    department: "Tech",
    status: "Late",
    checkIn: "10:14 AM",
    checkOut: "06:02 PM",
  },
  {
    id: 4,
    name: "Simran Kaur",
    department: "Finance",
    status: "Absent",
    checkIn: "-",
    checkOut: "-",
  },
  {
    id: 5,
    name: "Karan Desai",
    department: "Operations",
    status: "Present",
    checkIn: "08:55 AM",
    checkOut: "05:59 PM",
  },
];

const AttendanceTable = () => {

  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");

  const filteredData = fullData.filter((emp) => {
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
