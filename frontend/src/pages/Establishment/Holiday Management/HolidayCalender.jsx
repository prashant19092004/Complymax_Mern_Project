import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  getDay,
  addDays,
  isSameDay
} from "date-fns";
import "./HolidayCalendar.css";

const dummyHolidays = [
  { date: "2025-07-04", name: "Emergency Drill", type: "emergency" },
  { date: "2025-07-10", name: "Eid al-Adha", type: "religious" },
  { date: "2025-07-15", name: "Optional Leave", type: "optional" },
  { date: "2025-07-27", name: "Independence Day", type: "national" },
];

const HolidayCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const holidaysMap = dummyHolidays.reduce((map, h) => {
    map[h.date] = h;
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
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>←</button>
        <button onClick={() => setCurrentMonth(new Date())}>Today</button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>→</button>
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
                    <div className="phm-cell" key={index}>
                      {day && (
                        <>
                          <div className={`phm-date-number ${isToday ? "today" : ""}`}>
                            {format(day, "d")}
                          </div>
                          {holiday && (
                            <div className={`phm-holiday-label ${holiday.type}`}>
                              {holiday.name}
                            </div>
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
    <div className="phm-calendar-container">
      <div className="phm-calendar-toolbar">
        <h2>Holiday Calendar</h2>
        <div className="phm-actions">
          <button className="phm-toggle-btn">📅 Show Calendar</button>
          <button className="phm-add-btn">+ Add Holiday</button>
        </div>
      </div>
      {renderHeader()}
      {renderLegend()}
      {renderWeekdays()}
      {renderDates()}
    </div>
  );
};

export default HolidayCalendar;
