import React from "react";
import { SlCalender } from "react-icons/sl";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const HolidayForm = () => {
  return (
    <div className="phm-container" style={{margin : '20px'}}>
      {/* FORM CARD */}
      <div className="phm-card phm-form-card">
        <h3 className="phm-section-title">Add Public Holiday</h3>
        <form className="phm-holiday-form">
          <div className="phm-form-grid">
            <div className="phm-form-group">
              <label htmlFor="holidayName">Holiday Name</label>
              <input type="text" id="holidayName" placeholder="e.g., Christmas Day" />
            </div>
            <div className="phm-form-group">
              <label htmlFor="holidayType">Holiday Type</label>
              <select id="holidayType">
                <option value="">Select Holiday Type</option>
                <option value="official">Official Holiday</option>
                <option value="custom">Custom Holiday</option>
              </select>
            </div>
            <div className="phm-form-group">
              <label htmlFor="holidayDate">Date</label>
              <input type="date" id="holidayDate" />
            </div>
          </div>

          <div className="phm-form-group">
            <label htmlFor="holidayDesc">Description</label>
            <textarea id="holidayDesc" rows="3" placeholder="Enter description..."></textarea>
          </div>

          <div className="phm-form-actions">
            <button type="submit" className="phm-submit-btn">Add Holiday</button>
            <button type="reset" className="phm-reset-btn">Discard</button>
          </div>
        </form>
      </div>

      {/* RECENT HOLIDAYS: FULL WIDTH */}
      <div className="phm-recent-wrapper-wide">
  <div className="phm-recent-header">
    <h3>Upcoming Holidays</h3>
    <a href="#" className="phm-view-all">View All</a>
  </div>

  <ul className="phm-holiday-cards">
    {/* Holiday 1 */}
    <li className="phm-holiday-card">
      <input type="checkbox" />
      <div className="phm-icon-box" style={{ backgroundColor: "#ff4d4d" }}>🎄</div>
      <div className="phm-details">
        <div className="phm-title-row">
          <span className="phm-name">Christmas Day</span>
        </div>
        <p className="phm-meta">National Holiday • Dec 25, 2024</p>
      </div>
      <div className="phm-options" title="Delete"><MdDelete fontSize={30} /></div>
    </li>

    {/* Holiday 2 */}
    <li className="phm-holiday-card">
      <input type="checkbox" />
      <div className="phm-icon-box" style={{ backgroundColor: "#3b82f6" }}>🎆</div>
      <div className="phm-details">
        <div className="phm-title-row">
          <span className="phm-name">New Year's Day</span>
        </div>
        <p className="phm-meta">National Holiday • Jan 1, 2025</p>
      </div>
      <div className="phm-options" title="Delete"><MdDelete fontSize={30} /></div>
    </li>

    {/* Holiday 3 */}
    <li className="phm-holiday-card">
      <input type="checkbox" />
      <div className="phm-icon-box" style={{ backgroundColor: "#8b5cf6" }}>🦃</div>
      <div className="phm-details">
        <div className="phm-title-row">
          <span className="phm-name">Thanksgiving</span>
        </div>
        <p className="phm-meta">National Holiday • Nov 28, 2024</p>
      </div>
      <div className="phm-options" title="Delete"><MdDelete fontSize={30} /></div>
    </li>
  </ul>
</div>

    <Link to="/establisment_dashboard/holiday-management/calender">
    <button class="phm-show-calendar-btn"> 
      <SlCalender />
      <span>Show Calendar</span>
    </button>
    </Link>

    </div>
  );
};

export default HolidayForm;
