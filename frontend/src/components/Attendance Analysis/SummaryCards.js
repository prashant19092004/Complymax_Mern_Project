import React from "react";
import "./SummaryCards.css";

const SummaryCards = () => {
  return (
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
  );
};

export default SummaryCards;
