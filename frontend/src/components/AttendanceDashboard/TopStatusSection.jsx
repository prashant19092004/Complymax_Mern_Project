import React from 'react';
import styles from './TopStatusSection.module.css';

const TopStatusSection = () => {
  return (
    <div className={styles.cardsContainer}>
      <div className={`${styles.card} ${styles.blue}`}>
        <p className={styles.cardTitle}>Today's Status</p>
        <p className={styles.cardValue}>Not Checked In</p>
      </div>
      <div className={`${styles.card} ${styles.green}`}>
        <p className={styles.cardTitle}>This Month</p>
        <p className={styles.cardValue}>21 Days Present</p>
      </div>
      <div className={`${styles.card} ${styles.yellow}`}>
        <p className={styles.cardTitle}>Leave Balance</p>
        <p className={styles.cardValue}>12 Days</p>
      </div>
    </div>
  );
};

export default TopStatusSection;
