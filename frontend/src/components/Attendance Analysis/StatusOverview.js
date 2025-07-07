import React from "react";
import "./StatusOverview.css";

const StatusOverview = ({ todaySummery }) => {
  const data = [
    { label: "Present Today", value: todaySummery?.present || 0, color: "#10b981" },
    { label: "Absent Today", value: todaySummery?.absent || 0, color: "#ef4444" },
    { label: "On Leave", value: todaySummery?.onLeave || 0, color: "#f59e0b" },
    { label: "Late Arrivals", value: todaySummery?.late || 0, color: "#3b82f6" },
    { label: "Early Departures", value: todaySummery?.early || 0, color: "#8b5cf6" },
  ];

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
