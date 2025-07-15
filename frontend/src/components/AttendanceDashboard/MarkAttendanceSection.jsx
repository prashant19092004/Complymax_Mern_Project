import React from 'react';
import styles from './MarkAttendanceSection.module.css';
import { TbLogin2, TbLogout2 } from "react-icons/tb";

const MarkAttendanceSection = ({ onCheckIn, onCheckOut, todayStatus }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Mark Your Attendance</h3>

      <div className={styles.faceBox}>
        <div className={styles.faceCircle}></div>
      </div>

      {todayStatus === "Holiday" || todayStatus === "Leave" ? (
        <div className={styles.infoText}>
          Today is your {todayStatus}.
        </div>
      ) : (
        <div className={styles.buttonGroup}>
          <button className={styles.checkIn} onClick={onCheckIn}>
            <TbLogin2 className={styles.icon} />
            Check In
          </button>
          <button className={styles.checkOut} onClick={onCheckOut}>
            <TbLogout2 className={styles.icon} />
            Check Out
          </button>
        </div>
      )}
    </div>
  );
};

export default MarkAttendanceSection;
