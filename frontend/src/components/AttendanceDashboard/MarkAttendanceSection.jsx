import React from 'react';
import styles from './MarkAttendanceSection.module.css';
// import { CiLogout, CiLogin } from "react-icons/ci";
import { TbLogin2, TbLogout2 } from "react-icons/tb";

const MarkAttendanceSection = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Mark Your Attendance</h3>
      <div className={styles.faceBox}>
        <div className={styles.faceCircle}></div>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.checkIn}>
            <TbLogin2 className={styles.icon} />
          Check In
        </button>
        <button className={styles.checkOut}>
         <TbLogout2 className={styles.icon} />
         Check Out
        </button>
      </div>
    </div>
  );
};

export default MarkAttendanceSection;
