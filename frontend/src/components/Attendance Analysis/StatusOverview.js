import React from "react";
import "./StatusOverview.css";

const data = [
  { label: "Present Today", value: 120, color: "#10b981" },
  { label: "Absent Today", value: 8, color: "#ef4444" },
  { label: "On Leave", value: 5, color: "#f59e0b" },
  { label: "Late Arrivals", value: 6, color: "#3b82f6" },
  { label: "Early Departures", value: 3, color: "#8b5cf6" },
];

const StatusOverview = () => {
  return (
    <div className="status-overview-container">
      <h3>Employee Status Overview</h3>
      <div className="status-grid">
        {data.map((item, index) => (
          <div className="status-card" key={index}>
            <div
              className="status-icon"
              style={{ backgroundColor: item.color }}
            />
            <div className="status-info">
              <p className="status-label">{item.label}</p>
              <p className="status-value">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusOverview;
