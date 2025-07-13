import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  getDay,
  addDays,
  isSameDay,
} from "date-fns";
import "./HolidayCalendar.css";
import { useLocation, useNavigate } from "react-router-dom";
import ScrollToTop from "../../../ScrollToTop";

const HolidayCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const location = useLocation();
  const holidays = location.state || []; // fallback if no holidays passed
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const isMobile = window.innerWidth <= 768;
  const navigate = useNavigate();

  const holidaysMap = holidays.reduce((map, h) => {
    const formattedDate = format(new Date(h.date), "yyyy-MM-dd");
    map[formattedDate] = h;
    return map;
  }, {});

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startIndex = getDay(monthStart);

  const daysInMonth = [];
  for (let i = 0; i < startIndex; i++) {
    daysInMonth.push(null); // Empty cell
  }

  for (let d = 0; d <= monthEnd.getDate() - 1; d++) {
    daysInMonth.push(addDays(monthStart, d));
  }

  const renderHeader = () => (
    <div className="phm-calendar-header">
      <h3>{format(currentMonth, "MMMM yyyy")}</h3>
      <div className="phm-header-controls">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          ←
        </button>
        <button onClick={() => setCurrentMonth(new Date())}>Today</button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          →
        </button>
      </div>
    </div>
  );

  const renderLegend = () => (
    <div className="phm-legend">
      <span className="phm-dot national">National Holiday</span>
      <span className="phm-dot religious">Religious Holiday</span>
      <span className="phm-dot emergency">Emergency Holiday</span>
      <span className="phm-dot optional">Optional Holiday</span>
    </div>
  );

  const renderWeekdays = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="phm-days-row">
        {weekDays.map((day) => (
          <div className="phm-day-name" key={day}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderDates = () => {
    return (
      <div className="phm-body">
        {Array(Math.ceil(daysInMonth.length / 7))
          .fill()
          .map((_, rowIndex) => (
            <div className="phm-row" key={rowIndex}>
              {daysInMonth
                .slice(rowIndex * 7, rowIndex * 7 + 7)
                .map((day, index) => {
                  const formatted = day ? format(day, "yyyy-MM-dd") : null;
                  const holiday = day ? holidaysMap[formatted] : null;
                  const isToday = day && isSameDay(day, new Date());

                  return (
                    <div
                      className={`phm-cell ${
                        holiday ? "phm-holiday-cell" : ""
                      }`}
                      key={index}
                    >
                      {day && (
                        <>
                          <div
                            className={`phm-date-number ${
                              isToday ? "today" : ""
                            }`}
                          >
                            {format(day, "d")}
                          </div>
                          {holiday && (
                            <>
                              {!isMobile && (
                                <div
                                  className={`phm-holiday-label ${holiday.type}`}
                                >
                                  {holiday.name}
                                </div>
                              )}
                              {isMobile && (
                                <div
                                  className={`phm-holiday-dot ${holiday.type}`}
                                  onClick={() => setSelectedHoliday(holiday)}
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      <ScrollToTop />
      <div className="phm-calendar-container" style={{ margin : '15px'}}>
      <div className="phm-top-bar">
        <button className="phm-back-btn" onClick={() => navigate("/establisment_dashboard/holiday-management")}>
          ← Back to Dashboard
        </button>
      </div>
      <div className="phm-calendar-toolbar">
        <h2>Holiday Calendar</h2>
        <div className="phm-actions">
          <button className="phm-add-btn" onClick={() => navigate("/establisment_dashboard/holiday-management")}>+ Add Holiday</button>
        </div>
      </div>
      {renderHeader()}
      {renderLegend()}
      {renderWeekdays()}
      {renderDates()}

      {/* Mobile Modal Popup */}
      {isMobile && selectedHoliday && (
        <div className="phm-holiday-popup">
          <div className="phm-holiday-popup-content">
            <h4>{selectedHoliday.name}</h4>
            <p>{format(new Date(selectedHoliday.date), "MMM d, yyyy")}</p>
            <button onClick={() => setSelectedHoliday(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default HolidayCalendar;
