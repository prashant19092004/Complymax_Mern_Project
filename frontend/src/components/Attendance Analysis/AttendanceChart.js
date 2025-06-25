import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import "./AttendanceChart.css";

const data = [
  { month: "Jan", rate: 89 },
  { month: "Feb", rate: 90 },
  { month: "Mar", rate: 91 },
  { month: "Apr", rate: 89 },
  { month: "May", rate: 90.5 },
  { month: "Jun", rate: 91.2 },
  { month: "Jul", rate: 92.8 },
  { month: "Aug", rate: 94 },
  { month: "Sep", rate: 92 },
  { month: "Oct", rate: 81 },
  { month: "Nov", rate: 0 },
  { month: "Dec", rate: 0 },
];

const AttendanceChart = () => {
  return (
    <div className="chart-container">
      <h3>Monthly Attendance Rate</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis domain={[80, 100]} tickFormatter={(v) => `${v}%`} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(v) => `${v}%`} />
          <Area type="monotone" dataKey="rate" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRate)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
