import React from 'react'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../../../ScrollToTop'

const HolidayManagement = () => {
  return (
    <div>
        <ScrollToTop />
        <Outlet />
    </div>
  )
}

export default HolidayManagement