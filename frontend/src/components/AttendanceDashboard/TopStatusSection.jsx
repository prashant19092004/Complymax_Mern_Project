import React from 'react';
import styles from './TopStatusSection.module.css';

const TopStatusSection = ({ checkedIn, presentDays, balanceLeave}) => {
  return (
    <div className={styles.cardsContainer}>
      <div className={`${styles.card} ${styles.blue}`}>
        <p className={styles.cardTitle}>Today's Status</p>
        <p className={styles.cardValue}>{checkedIn ? "Checked In" : "Not Checked In"}</p>
      </div>
      <div className={`${styles.card} ${styles.green}`}>
        <p className={styles.cardTitle}>This Month</p>
        <p className={styles.cardValue}>{presentDays} {presentDays > 1 ? 'Days' : 'Day'} Present</p>
      </div>
      <div className={`${styles.card} ${styles.yellow}`}>
        <p className={styles.cardTitle}>Leave Balance</p>    
        <p className={styles.cardValue}>{balanceLeave} {balanceLeave > 1 ? 'Days' : 'Day'}</p>
      </div>
      <div className={`${styles.card} ${styles.yellow}`}>
        <p className={styles.cardTitle}>Absent</p>
        <p className={styles.cardValue}>{balanceLeave} {balanceLeave > 1 ? 'Days' : 'Day'}</p>
      </div>
    </div>
  );
};

export default TopStatusSection;
