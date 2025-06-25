// src/pages/UserDashboardPage.jsx

import React from 'react';
import TopStatusSection from '../../../components/AttendanceDashboard/TopStatusSection';
import MarkAttendanceSection from '../../../components/AttendanceDashboard/MarkAttendanceSection';
import AttendanceHistoryTable from '../../../components/AttendanceDashboard/AttendanceHistoryTable';

const Attendance = () => {
  return (
    <div>
      <TopStatusSection />
      <MarkAttendanceSection />
      <AttendanceHistoryTable />
    </div>
  );
};

export default Attendance;
