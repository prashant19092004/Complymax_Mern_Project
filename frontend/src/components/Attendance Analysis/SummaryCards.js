import React from "react";
import "./SummaryCards.css";

const SummaryCards = ({ calculatedMonthlyData }) => {
  const {
    currentMonth,
    change,
  } = calculatedMonthlyData || {};

  return (
    <div className="summary-container">
      {/* Attendance Rate */}
      <div className="card success">
        <h4>Overall Attendance Rate</h4>
        <p className="main-value">
          {currentMonth?.attendanceRate?.toFixed(1) || 0}%
        </p>
        <span
          className={`change ${
            change?.attendanceRateChange > 0 ? "up" : "down"
          }`}
        >
          {change?.attendanceRateChange > 0 ? "↑" : "↓"}{" "}
          {Math.abs(change?.attendanceRateChange || 0).toFixed(2)}% from last month
        </span>
      </div>

      {/* Absence Rate */}
      <div className="card error">
        <h4>Absence Rate</h4>
        <p className="main-value">
          {currentMonth?.absenceRate?.toFixed(1) || 0}%
        </p>
        <span
          className={`change ${
            change?.absenceRateChange > 0 ? "up" : "down"
          }`}
        >
          {change?.absenceRateChange > 0 ? "↑" : "↓"}{" "}
          {Math.abs(change?.absenceRateChange || 0).toFixed(2)}% from last month
        </span>
      </div>

      {/* Late Arrivals */}
      <div className="card info">
        <h4>Late Arrivals</h4>
        <p className="main-value">
          {currentMonth?.lateArrivalRate?.toFixed(1) || 0}%
        </p>
        <span
          className={`change ${
            change?.lateArrivalRateChange > 0 ? "up" : "down"
          }`}
        >
          {change?.lateArrivalRateChange > 0 ? "↑" : "↓"}{" "}
          {Math.abs(change?.lateArrivalRateChange || 0).toFixed(2)}% from last month
        </span>
      </div>

      {/* Early Departures */}
      <div className="card purple">
        <h4>Early Departures</h4>
        <p className="main-value">
          {currentMonth?.earlyDepartureRate?.toFixed(1) || 0}%
        </p>
        <span
          className={`change ${
            change?.earlyDepartureRateChange > 0 ? "up" : "down"
          }`}
        >
          {change?.earlyDepartureRateChange > 0 ? "↑" : "↓"}{" "}
          {Math.abs(change?.earlyDepartureRateChange || 0).toFixed(2)}% from last month
        </span>
      </div>
    </div>
  );
};

export default SummaryCards;
