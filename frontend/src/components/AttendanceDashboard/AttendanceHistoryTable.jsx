import React from "react";
import styles from "./AttendanceHistoryTable.module.css";



const AttendanceHistoryTable = ({ attendance }) => {

  function formatTimeIST(timeString) {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}


function formatDateToIST(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


  return (
    <div className={styles.tableSection}>
      <h3 className={styles.heading}>Recent Attendance History</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Working Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((row, idx) => (
              <tr key={idx}>
                <td data-label="Date">{formatDateToIST(row.date)}</td>
                <td data-label="Check In">{formatTimeIST(row.checkInTime)}</td>
                <td data-label="Check Out">{formatTimeIST(row.checkOutTime)}</td>
                <td data-label="Working Hours">{row.totalHours} Hours</td>
                <td data-label="Status">
                  <span
                    className={`${styles.status} ${
                      row.status === "Present" ? styles.present : styles.absent
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceHistoryTable;
