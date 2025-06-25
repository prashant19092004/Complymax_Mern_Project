import React from 'react'
import SummaryCards from '../../../components/Attendance Analysis/SummaryCards'
import AttendanceChart from '../../../components/Attendance Analysis/AttendanceChart'
import StatusOverview from '../../../components/Attendance Analysis/StatusOverview'
import AttendanceTable from '../../../components/Attendance Analysis/AttendanceTable'
import LocationMap from '../../../components/Attendance Analysis/LocationMap'

const AttandanceAnalysis = () => {
  return (
    <div style={{ background: "#f5f7ff", minHeight: "100vh", paddingTop: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Attendance Dashboard</h2>
      <SummaryCards />
      <AttendanceChart />
      <StatusOverview />
      <AttendanceTable />
      <LocationMap />
      <div style={{height : '100px', width : '100%'}}></div>
    </div>
  )
}

export default AttandanceAnalysis