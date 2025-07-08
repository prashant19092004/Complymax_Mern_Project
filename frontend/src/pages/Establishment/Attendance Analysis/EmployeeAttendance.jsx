import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams, Link } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./EmployeeAttendance.css";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend, Filler } from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend, Filler);

const EmployeeAttendance = () => {
  const { id } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [monthlyLabels, setMonthlyLabels] = useState([]);
  const [monthlyValues, setMonthlyValues] = useState([]);
  const [lateDays, setLateDays] = useState(0);
  const [earlyLeaveDays, setEarlyLeaveDays] = useState(0);
  const [absentRate, setAbsentRate] = useState(0);
  const [checkInLabels, setCheckInLabels] = useState([]);
  const [checkInValues, setCheckInValues] = useState([]);
  const [weeklyLabels, setWeeklyLabels] = useState([]);
  const [weeklyValues, setWeeklyValues] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/establishment/attendance/employee-record/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userData = res.data.employeeData;
        setData(userData);

        const attendance = userData.attendance || [];

        const trend = calculateMonthlyAttendanceTrends(attendance);
        setMonthlyLabels(trend.labels);
        setMonthlyValues(trend.values);

        const summary = getLateEarlySummary(attendance);
        setLateDays(summary.lateDays);
        setEarlyLeaveDays(summary.earlyLeaveDays);
        setAbsentRate(summary.absentRate);

        const checkIn = getCheckInTimeBuckets(attendance);
        setCheckInLabels(checkIn.labels);
        setCheckInValues(checkIn.values);

        const weekly = getWeeklyWorkHours(attendance);
        setWeeklyLabels(weekly.labels);
        setWeeklyValues(weekly.averages);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading || !data) return <div>Loading...</div>;

  const chartData = {
    labels: monthlyLabels,
    datasets: [{
      label: "Attendance %",
      data: monthlyValues,
      fill: true,
      backgroundColor: "rgba(79, 70, 229, 0.1)",
      borderColor: "#4f46e5",
      tension: 0.4,
    }],
  };

  const checkInData = {
    labels: checkInLabels,
    datasets: [{
      label: "Days",
      data: checkInValues,
      backgroundColor: ["#34d399", "#34d399", "#fbbf24", "#fbbf24", "#f87171"],
      borderRadius: 6,
    }],
  };

  const workHoursData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: "Daily Average",
        data: weeklyValues,
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "#3b82f6",
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: "Required Hours",
        data: Array(weeklyLabels.length).fill(8),
        borderColor: "#9ca3af",
        borderDash: [5, 5],
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="emp-attendance-container">
      <div className="emp-header">
        <Link to="/establisment_dashboard/attendance-analysis" className="emp-back-link">
          <FaArrowLeft /> <p>Back to Dashboard</p>
        </Link>
      </div>

      <div className="emp-header-bar">
        <div className="emp-avatar-block">
          <div className="emp-initials">{data?.full_Name?.split(" ").map(w => w[0]).join("")}</div>
          <div className="emp-text-info">
            <h3>{data?.full_Name}</h3>
            <div className="emp-details-row">
              <span><IoPersonOutline /> {data?.hired?.job_category}</span>
              <span><MdOutlineEmail /> {data?.email}</span>
            </div>
          </div>
        </div>
        <div className="emp-actions">
          <button className="emp-btn"><MdOutlineEmail /> Email</button>
          <button className="emp-btn"><FaPencilAlt /> Add Note</button>
          <button className="emp-btn primary"><FiDownload /> Export Report</button>
        </div>
      </div>

      <div className="summary-container">
        <div className="card success">
          <h4>Attendance Rate</h4>
          <p className="main-value">{monthlyValues?.[monthlyValues.length - 1] || 0}%</p>
        </div>
        <div className="card error">
          <h4>Absent Rate</h4>
          <p className="main-value">{absentRate}%</p>
        </div>
        <div className="card info">
          <h4>Late Arrivals</h4>
          <p className="main-value">{lateDays}</p>
        </div>
        <div className="card purple">
          <h4>Early Departures</h4>
          <p className="main-value">{earlyLeaveDays}</p>
        </div>
      </div>

      <div className="emp-visual-row">
        <div className="emp-chart-box">
          <h4>Monthly Attendance</h4>
          <Line data={chartData} />
        </div>
        <div className="calendar-card">
          <h4>Attendance Calendar</h4>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date }) => {
              const localDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).toLocaleDateString("en-CA");
              const found = data.attendance.find(att => {
                const attDate = new Date(att.date).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
                return attDate === localDate;
              });
              return found ? `calendar-${found.status.toLowerCase()}` : null;
            }}
          />
        </div>
      </div>

      <div className="emp-table-box">
        <h4>Daily Attendance</h4>
        <table className="emp-daily-table">
          <thead>
            <tr><th>Date</th><th>Status</th><th>Check-In</th><th>Check-Out</th></tr>
          </thead>
          <tbody>
            {data.attendance.map((rec, i) => (
              <tr key={i}>
                <td>{new Date(rec.date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                <td className={`status ${rec.status.toLowerCase()}`}>{rec.status}</td>
                <td>{rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) : "--"}</td>
                <td>{rec.checkOutTime ? new Date(rec.checkOutTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) : "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="emp-extra-charts">
        <div className="emp-chart-box">
          <h4>Check-in Distribution</h4>
          <Bar data={checkInData} />
        </div>
        <div className="emp-chart-box">
          <h4>Work Hours Trend</h4>
          <Line data={workHoursData} />
        </div>
      </div>
    </div>
  );
};

// -------------------------- HELPERS --------------------------
const calculateMonthlyAttendanceTrends = (attendance = []) => {
  const trends = {};
  attendance.forEach(({ date, status }) => {
    const month = new Date(date).toLocaleString("default", { month: "short" });
    if (!trends[month]) trends[month] = { present: 0, total: 0 };
    if (status === "Present") trends[month].present++;
    trends[month].total++;
  });
  const labels = Object.keys(trends);
  const values = labels.map(m => ((trends[m].present / trends[m].total) * 100).toFixed(1));
  return { labels, values };
};

const getLateEarlySummary = (attendance = []) => {
  let lateDays = 0, earlyLeaveDays = 0, absentDays = 0;
  attendance.forEach(({ lateByMinutes, earlyCheckOutByMinutes, status }) => {
    if (lateByMinutes > 0) lateDays++;
    if (earlyCheckOutByMinutes > 0) earlyLeaveDays++;
    if (status === "Absent") absentDays++;
  });
  const absentRate = attendance.length ? ((absentDays / attendance.length) * 100).toFixed(1) : 0;
  return { lateDays, earlyLeaveDays, absentRate };
};

const getCheckInTimeBuckets = (attendance = []) => {
  const buckets = {
    "8:30-8:45": 0,
    "8:45-9:00": 0,
    "9:00-9:15": 0,
    "9:15-9:30": 0,
    "After 9:30": 0,
  };
  attendance.forEach(({ checkInTime }) => {
    if (!checkInTime) return;
    const d = new Date(checkInTime);
    const min = d.getHours() * 60 + d.getMinutes();
    if (min >= 510 && min < 525) buckets["8:30-8:45"]++;
    else if (min < 540) buckets["8:45-9:00"]++;
    else if (min < 555) buckets["9:00-9:15"]++;
    else if (min < 570) buckets["9:15-9:30"]++;
    else buckets["After 9:30"]++;
  });
  return { labels: Object.keys(buckets), values: Object.values(buckets) };
};

const getWeeklyWorkHours = (attendance = []) => {
  const map = {};
  attendance.forEach(({ date, totalHours }) => {
    const week = Math.ceil(new Date(date).getDate() / 7);
    if (!map[week]) map[week] = [];
    map[week].push(totalHours);
  });
  const labels = [], averages = [];
  for (let i = 1; i <= 5; i++) {
    labels.push(`Week ${i}`);
    const hours = map[i] || [];
    const avg = hours.length ? (hours.reduce((a, b) => a + b, 0) / hours.length).toFixed(2) : 0;
    averages.push(parseFloat(avg));
  }
  return { labels, averages };
};

export default EmployeeAttendance;
