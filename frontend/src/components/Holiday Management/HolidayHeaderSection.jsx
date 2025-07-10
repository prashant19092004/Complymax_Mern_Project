import React from "react";
import "./Holiday.css";

const HolidayHeaderSection = () => {
  return (
    <>
      {/* public-holiday-dashboard.html  */}
      <div class="phm-header">
        <div class="phm-header-left">
          <h1>Public Holiday Management</h1>
          <p>Assign and manage your organization's public holidays with ease</p>
        </div>
        <div class="phm-header-right">
          <input
            type="text"
            placeholder="Search holiday..."
            class="phm-search-input"
          />
          <button class="phm-signin-btn">Sign In</button>
        </div>
      </div>
    </>
  );
};

export default HolidayHeaderSection;
