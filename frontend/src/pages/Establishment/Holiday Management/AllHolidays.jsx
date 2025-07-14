import React, { useState, useEffect } from "react";
import { SlCalender } from "react-icons/sl";
import { MdDelete } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa"; // universal calendar icon
import axios from "axios";
import { toast } from "react-toastify";

const AllHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  function formatHolidayDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const handleCheckboxChange = (holidayId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [holidayId]: !prev[holidayId],
    }));
  };

  const sortedHolidays = [...holidays].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const handleDelete = async (holidayId) => {
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
        // console.log(res);
        toast.success("Holiday deleted successfully!");
        fetchHolidays();
        // Optionally refresh the list of holidays
      } else {
        toast.error("Failed to delete holiday.");
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error("Something went wrong while deleting.");
    }
  };


  const fetchHolidays = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/holiday-management/get-holidays`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHolidays(response.data.holidays);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [token]);

  if(loading){
    return (
        <div>Loading...</div>
    )
  }
  return (
    <>
      <div className="phm-recent-wrapper-wide">
        <div className="phm-recent-header">
          <h3>All Holidays</h3>
        </div>

        <ul className="phm-holiday-cards">
          {sortedHolidays &&
            sortedHolidays.map((holiday) => (
              <li className="phm-holiday-card" key={holiday._id}>
                <input
                  type="checkbox"
                  checked={!!checkedItems[holiday._id]}
                  onChange={() => handleCheckboxChange(holiday._id)}
                />
                <div
                  className="phm-icon-box"
                  style={{ backgroundColor: "#ff4d4d" }}
                >
                  <FaRegCalendarAlt />
                </div>
                <div className="phm-details">
                  <div className="phm-title-row">
                    <span className="phm-name">{holiday.name}</span>
                  </div>
                  <p className="phm-meta">
                    {holiday.type} Holiday • {formatHolidayDate(holiday.date)}
                  </p>
                </div>
                {checkedItems[holiday._id] && (
                  <div className="phm-options" title="Delete">
                    <MdDelete
                      fontSize={30}
                      onClick={() => handleDelete(holiday._id)}
                    />
                  </div>
                )}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default AllHolidays;
