import React, { useState, useEffect } from "react";
import HolidayHeaderSection from "../../../components/Holiday Management/HolidayHeaderSection";
import HolidayStatsSection from "../../../components/Holiday Management/HolidayStatsSection";
import HolidayForm from "../../../components/Holiday Management/HolidayForm";
import axios from 'axios';

const Holiday = () => {

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [holidays, setHolidays] = useState();
  const [establishment, setEstablishment] = useState();

  useEffect(() => {
      const fetchLeaveRequests = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/establishment/holiday-management/get-data`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setEstablishment(response.data.establishment);
          console.log(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching leave requests:", error);
          setLoading(false);
        }
      };
  
      fetchLeaveRequests();
    }, [token]);
  
    if(loading){
      return (<div>Loading...</div>)
    }

  return (
    <>
      <HolidayHeaderSection />
      <HolidayStatsSection />
      <HolidayForm />
    </>
  );
};

export default Holiday;
