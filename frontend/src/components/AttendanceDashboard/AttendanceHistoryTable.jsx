import React from "react";
import styles from "./AttendanceHistoryTable.module.css";

const attendanceData = [
  {
    date: "14 Jul 2023",
    checkIn: "09:02 AM",
    checkOut: "06:15 PM",
    hours: "9h 13m",
    status: "Present",
  },
  {
    date: "13 Jul 2023",
    checkIn: "09:15 AM",
    checkOut: "05:45 PM",
    hours: "8h 30m",
    status: "Present",
  },
  {
    date: "12 Jul 2023",
    checkIn: "-",
    checkOut: "-",
    hours: "-",
    status: "Absent",
  },
  {
    date: "11 Jul 2023",
    checkIn: "09:30 AM",
    checkOut: "06:00 PM",
    hours: "8h 30m",
    status: "Present",
  },
  {
    date: "10 Jul 2023",
    checkIn: "09:05 AM",
    checkOut: "05:55 PM",
    hours: "8h 50m",
    status: "Present",
  },
];

const AttendanceHistoryTable = () => {
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
            {attendanceData.map((row, idx) => (
              <tr key={idx}>
                <td data-label="Date">{row.date}</td>
                <td data-label="Check In">{row.checkIn}</td>
                <td data-label="Check Out">{row.checkOut}</td>
                <td data-label="Working Hours">{row.hours}</td>
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
