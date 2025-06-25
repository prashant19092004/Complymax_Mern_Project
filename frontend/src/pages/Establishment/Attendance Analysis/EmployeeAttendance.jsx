import React, { useState } from "react";
import "./EmployeeAttendance.css";
import { Line } from "react-chartjs-2";
import { IoBagRemoveOutline, IoPersonOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, BarElement,
  Tooltip,
  Legend,
  Filler);

const EmployeeAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const employee = {
    name: "Jane Doe",
    initials: "JD",
    department: "Engineering",
    role: "Senior Developer",
    email: "jane.doe@example.com",
  };

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
    ],
    datasets: [
      {
        label: "Attendance %",
        data: [92, 90, 91, 93, 89, 95, 96, 94, 97, 95],
        fill: true,
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        borderColor: "#4f46e5",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  const dailyRecords = [
    {
      date: "2025-06-10",
      status: "Present",
      checkIn: "09:05 AM",
      checkOut: "05:10 PM",
    },
    {
      date: "2025-06-11",
      status: "Late",
      checkIn: "09:35 AM",
      checkOut: "05:15 PM",
    },
    {
      date: "2025-06-12",
      status: "Present",
      checkIn: "09:00 AM",
      checkOut: "05:10 PM",
    },
    { date: "2025-06-13", status: "Absent", checkIn: "--", checkOut: "--" },
    { date: "2025-06-14", status: "Leave", checkIn: "--", checkOut: "--" },
  ];

  const checkInData = {
  labels: ["8:30-8:45", "8:45-9:00", "9:00-9:15", "9:15-9:30", "After 9:30"],
  datasets: [
    {
      label: "Days",
      data: [5, 12, 4, 2, 0],
      backgroundColor: ["#34d399", "#34d399", "#fbbf24", "#fbbf24", "#f87171"],
      borderRadius: 6,
    },
  ],
};

const checkInOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 2,
      },
    },
  },
};

const workHoursData = {
  labels: [
    "Week 1",
    "Week 2",
    "Week 3",
    "Week 4",
    "Week 5",
    "Week 6",
    "Week 7",
    "Week 8",
  ],
  datasets: [
    {
      label: "Daily Average",
      data: [8.1, 8.4, 8.0, 8.5, 8.2, 8.6, 8.4, 8.2],
      fill: true,
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      borderColor: "#3b82f6",
      tension: 0.4,
      pointRadius: 3,
    },
    {
      label: "Required Hours",
      data: Array(8).fill(8),
      borderColor: "#9ca3af",
      borderDash: [5, 5],
      pointRadius: 0,
    },
  ],
};

const workHoursOptions = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        callback: (val) => `${val} hrs`,
        stepSize: 0.2,
        beginAtZero: false,
        min: 7.5,
        max: 9,
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
      },
    },
  },
};


  return (
    <div className="emp-attendance-container" style={{ paddingBottom: "20px" }}>
      {/* Profile Header */}
      <div className="emp-header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link to="/establisment_dashboard/attendance-analysis" className="emp-back-link d-flex justify-content-center align-items-center gap-1">
          <FaArrowLeft />
          <p>Back to Dashboard</p>
        </Link>
      </div>
      <div className="emp-header-bar">
        <div className="emp-avatar-block">
          <div className="emp-initials">{employee.initials}</div>
          <div className="emp-text-info">
            <h3>{employee.name}</h3>
            <div className="emp-details-row d-flex justify-content-center align-items-center">
              {/* <span className="d-flex justify-content-center align-items-center gap-1">
                <IoBagRemoveOutline /> {employee.department}
              </span> */}
              <span className="d-flex justify-content-center align-items-center gap-1">
                <IoPersonOutline /> {employee.role}
              </span>
              <span className="d-flex justify-content-center align-items-center gap-1">
                <MdOutlineEmail /> {employee.email}
              </span>
            </div>
          </div>
        </div>
        <div className="emp-actions">
          <button className="emp-btn d-flex justify-content-center align-items-center gap-1">
            <MdOutlineEmail /> Email
          </button>
          <button className="emp-btn d-flex justify-content-center align-items-center gap-1">
            <FaPencilAlt /> Add Note
          </button>
          <button className="emp-btn primary d-flex justify-content-center align-items-center gap-1">
            <FiDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-container">
        <div className="card success">
          <h4>Overall Attendance Rate</h4>
          <p className="main-value">92.7%</p>
          <span className="change up">↑ 2.3% from last month</span>
        </div>
        <div className="card error">
          <h4>Absence Rate</h4>
          <p className="main-value">7.3%</p>
          <span className="change down">↓ 1.5% from last month</span>
        </div>
        <div className="card info">
          <h4>Late Arrivals</h4>
          <p className="main-value">4.2%</p>
          <span className="change up">↑ 0.8% improvement</span>
        </div>
        <div className="card purple">
          <h4>Early Departures</h4>
          <p className="main-value">2.8%</p>
          <span className="change up">↑ 0.5% improvement</span>
        </div>
      </div>

      {/* Chart & Calendar Section */}
      <div className="emp-visual-row">
        <div className="emp-chart-box">
          <h4>Monthly Attendance Rate</h4>
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="calendar-card">
          <h4>Attendance Calendar</h4>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date }) => {
              const d = date.toLocaleDateString("en-CA");
              const record = dailyRecords.find((rec) => rec.date === d);
              return record ? `calendar-${record.status.toLowerCase()}` : null;
            }}
          />
        </div>
      </div>

      {/* Daily Attendance Table */}
      <div className="emp-table-box">
        <h4>Daily Attendance</h4>
        <table className="emp-daily-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Check-In</th>
              <th>Check-Out</th>
            </tr>
          </thead>
          <tbody>
            {dailyRecords.map((rec, i) => (
              <tr key={i}>
                <td>{rec.date}</td>
                <td className={`status ${rec.status.toLowerCase()}`}>
                  {rec.status}
                </td>
                <td>{rec.checkIn}</td>
                <td>{rec.checkOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔷 Charts Section */}
<div className="emp-extra-charts">
  {/* Check-in Time Distribution */}
  <div className="emp-chart-box">
    <h4>Check-in Time Distribution</h4>
    <Bar data={checkInData} options={checkInOptions} />
  </div>

  {/* Work Hours Trend */}
  <div className="emp-chart-box">
    <h4>Work Hours Trend</h4>
    <Line data={workHoursData} options={workHoursOptions} />
  </div>
</div>

    </div>
  );
};

export default EmployeeAttendance;
