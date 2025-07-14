import React, { useState, useEffect } from "react";
import HolidayHeaderSection from "../../../components/Holiday Management/HolidayHeaderSection";
import HolidayStatsSection from "../../../components/Holiday Management/HolidayStatsSection";
import HolidayForm from "../../../components/Holiday Management/HolidayForm";
import axios from "axios";
import { toast } from "react-toastify";
const moment = require("moment");

const Holiday = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [establishment, setEstablishment] = useState();
  const [statsData, setStatsData] = useState();

  function analyzeHolidays(holidays) {
    const today = moment().startOf("day");
    const currentMonth = today.month(); // 0-indexed
    const currentYear = today.year();

    const startOfWeek = today.clone().startOf("week"); // Sunday
    const endOfWeek = today.clone().endOf("week"); // Saturday

    let currentMonthHolidays = [];
    let currentWeekHolidays = [];
    let officialHolidays = [];
    let customHolidays = [];
    let upcomingHolidays = [];

    const upcoming = [];

    for (const holiday of holidays) {
      const holidayDate = moment(holiday.date);

      // Holidays in current month
      if (
        holidayDate.month() === currentMonth &&
        holidayDate.year() === currentYear
      ) {
        currentMonthHolidays.push(holiday);
      }

      // Holidays in current week
      if (holidayDate.isBetween(startOfWeek, endOfWeek, undefined, "[]")) {
        currentWeekHolidays.push(holiday);
      }

      // Type-wise
      if (holiday.type === "official") {
        officialHolidays.push(holiday);
      } else if (holiday.type === "custom") {
        customHolidays.push(holiday);
      }

      // Upcoming (after today)
      if (holidayDate.isAfter(today)) {
        upcoming.push({ ...holiday, dateObj: holidayDate });
      }
    }

    // Sort upcoming holidays by date
    upcoming.sort((a, b) => a.dateObj - b.dateObj);

    // Take top 3 upcoming holidays and return full objects (with _id)
    upcomingHolidays = upcoming.slice(0, 3).map((holiday) => {
      const { dateObj, ...rest } = holiday;
      return rest; // preserves _id and all fields
    });

    return {
      total: holidays.length,
      currentMonthHolidays,
      currentWeekHolidays,
      officialHolidays,
      customHolidays,
      upcomingHolidays, // includes _id
    };
  }

  const handleDelete = async (holidayId) => {
    console.log(holidayId);
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/holiday-management/delete/${holidayId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Holiday deleted successfully!");
        fetchLeaveRequests();
        // Optionally refresh the list of holidays
      } else {
        toast.error("Failed to delete holiday.");
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error("Something went wrong while deleting.");
    }
  };

  const fetchHolidayData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/holiday-management/get-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEstablishment(response.data.establishmentData);
      setStatsData(analyzeHolidays(response.data?.establishmentData?.holidays));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidayData();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HolidayHeaderSection />
      <HolidayStatsSection statsData={statsData} />
      <HolidayForm
        upcomingHolidays={statsData?.upcomingHolidays}
        handleDelete={handleDelete}
        fetchLeaveRequests={fetchLeaveRequests}
        holidays={establishment?.holidays}
      />
    </>
  );
};

export default Holiday;
