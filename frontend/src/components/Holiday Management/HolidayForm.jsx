import React from "react";
import { useState } from "react";
import { SlCalender } from "react-icons/sl";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa"; // universal calendar icon
import axios from 'axios';
import { toast } from "react-toastify";

const HolidayForm = ({ upcomingHolidays, handleDelete, fetchLeaveRequests }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    date: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !formData.date) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/holiday-management/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Holiday added successfully!");
        setFormData({ name: "", type: "", date: "", description: "" }); // reset form
        fetchLeaveRequests(); // refresh holiday list (passed from parent)
      } else {
        toast.error(res.data.message || "Failed to add holiday.");
      }
    } catch (error) {
      console.error("Error adding holiday:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  function formatHolidayDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="phm-container" style={{ margin: "20px" }}>
      {/* FORM CARD */}
      <div className="phm-card phm-form-card">
        <h3 className="phm-section-title">Add Public Holiday</h3>
        <form className="phm-holiday-form" onSubmit={handleSubmit}>
          <div className="phm-form-grid">
            <div className="phm-form-group">
              <label htmlFor="name">Holiday Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Christmas Day"
              />
            </div>
            <div className="phm-form-group">
              <label htmlFor="type">Holiday Type</label>
              <select id="type" value={formData.type} onChange={handleChange}>
                <option value="">Select Holiday Type</option>
                <option value="official">Official Holiday</option>
                <option value="custom">Custom Holiday</option>
                <option value="weekend">Weekend Holiday</option>
              </select>
            </div>
            <div className="phm-form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="phm-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter description..."
            ></textarea>
          </div>

          <div className="phm-form-actions">
            <button type="submit" className="phm-submit-btn">
              Add Holiday
            </button>
            <button type="reset" onClick={() => {setFormData({ name: "", type: "", date: "", description: "" });}} className="phm-reset-btn">
              Discard
            </button>
          </div>
        </form>
      </div>

      {/* RECENT HOLIDAYS: FULL WIDTH */}
      <div className="phm-recent-wrapper-wide">
        <div className="phm-recent-header">
          <h3>Upcoming Holidays</h3>
          <a href="#" className="phm-view-all">
            View All
          </a>
        </div>

        <ul className="phm-holiday-cards">
          {/* Holiday 1 */}
          {upcomingHolidays &&
            upcomingHolidays.map((holiday) => (
              <li className="phm-holiday-card">
                <input type="checkbox" />
                <div
                  className="phm-icon-box"
                  style={{ backgroundColor: "#ff4d4d" }}
                >
                  <FaRegCalendarAlt />
                </div>
                <div className="phm-details">
                  <div className="phm-title-row">
                    <span className="phm-name">{holiday.name}</span>
                  </div>
                  <p className="phm-meta">
                    {holiday.type} Holiday • {formatHolidayDate(holiday.date)}
                  </p>
                </div>
                <div className="phm-options" title="Delete">
                  <MdDelete
                    fontSize={30}
                    onClick={() => handleDelete(holiday._id)}
                  />
                </div>
              </li>
            ))}
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
