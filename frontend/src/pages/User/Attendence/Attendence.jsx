import React, { useEffect, useState, useRef } from 'react';
import TopStatusSection from '../../../components/AttendanceDashboard/TopStatusSection';
import MarkAttendanceSection from '../../../components/AttendanceDashboard/MarkAttendanceSection';
import AttendanceHistoryTable from '../../../components/AttendanceDashboard/AttendanceHistoryTable';
import FaceCapture from './FaceCapture';
import { toast } from 'react-toastify';
import axios from 'axios';
import Webcam from 'react-webcam';
import { getToken } from '../../../utils/tokenService.js';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
  const [userData, setUserData] = useState(null);
  const [attendance, setAttendance] = useState([]); // 🧠 CHANGED - store attendance separately
  const [page, setPage] = useState(1); // 🧠 CHANGED - track pagination page
  const [hasMore, setHasMore] = useState(true); // 🧠 CHANGED - track if more pages left
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState('check-in');
  const webcamRef = useRef(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [todayStatus, setTodayStatus] = useState("Not Checked In");
  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);
  const [balanceLeave, setBalanceLeave] = useState(0);
  const isApp = Capacitor.isNativePlatform();
  const navigate = useNavigate();

  const isCheckedInToday = (attendanceArray) => {
    const today = new Date();
    return attendanceArray.some((record) => {
      const checkInDate = new Date(record.checkInTime);
      return (
        checkInDate.getDate() === today.getDate() &&
        checkInDate.getMonth() === today.getMonth() &&
        checkInDate.getFullYear() === today.getFullYear()
      );
    });
  };

  function getTodayStatus(userData, attendanceData) { // 🧠 CHANGED - pass attendanceData
    const today = new Date();
    const isSameDate = (dateStr) => {
      const d = new Date(dateStr);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    };

    const isHoliday = attendanceData[0]?.establishment?.holidays?.some(holiday =>
      isSameDate(holiday.date)
    );
    if (isHoliday) return "Holiday";

    const isOnLeave = userData.leaveRequests?.some(leave => {
      if (leave.status !== "Approved") return false;
      const from = new Date(leave.from);
      const to = new Date(leave.to);
      return today >= from && today <= to;
    });
    if (isOnLeave) return "Leave";

    const isCheckedIn = attendanceData?.some(record => isSameDate(record.checkInTime));
    return isCheckedIn ? "Checked In" : "Not Checked In";
  }

  function getMonthlyPresentCount(attendanceArray) {
    const now = new Date();
    return attendanceArray.filter((record) => {
      const date = new Date(record.date);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear() &&
        record.status === "Present"
      );
    }).length;
  }

  function getMonthlyAbsentCount(attendanceArray) {
    const now = new Date();
    return attendanceArray.filter((record) => {
      const date = new Date(record.date);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear() &&
        record.status === "Absent"
      );
    }).length;
  }

  const calculateBalanceLeave = (userData, attendanceData) => {
    const earnedLeave = attendanceData[0]?.establishment?.earnedLeave || 0;
    const casualLeave = attendanceData[0]?.establishment?.casualLeave || 0;
    const medicalLeave = attendanceData[0]?.establishment?.medicalLeave || 0;
    const leaveTaken = userData?.leaveTaken || 0;
    const totalAllocatedLeave = earnedLeave + casualLeave + medicalLeave;
    return Math.max(totalAllocatedLeave - leaveTaken, 0);
  };

  const handleCheckIn = () => navigate('/face-attendance/check-in');
  const handleCheckOut = () => navigate('/face-attendance/check-out');

  // 🧠 CHANGED - fetch user data with pagination
  const fetchUserData = async (reset = false) => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/attendance/user-data?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) throw new Error(response.data.message);
      const data = response.data.userData;

      if (reset) setUserData(data);

      // merge attendance pages
      setAttendance((prev) =>
        reset ? data.attendance : [...prev, ...data.attendance]
      );

      // pagination control
      const { currentPage, totalPages } = response.data.pagination;
      setHasMore(currentPage < totalPages);

      // update dashboard stats only once (on first load)
      if (page === 1 || reset) {
        setCheckedIn(isCheckedInToday(data.attendance));
        setTodayStatus(getTodayStatus(data, data.attendance));
        setPresentDays(getMonthlyPresentCount(data.attendance));
        setAbsentDays(getMonthlyAbsentCount(data.attendance));
        setBalanceLeave(calculateBalanceLeave(data, data.attendance));
      }
    } catch (error) {
      toast.error('Error fetching user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setAttendance([]);
    setHasMore(true);
    setLoading(true);
    fetchUserData(true);
  }, [refreshKey]);

  // 🧠 CHANGED - load more attendance when user clicks
  const loadMoreAttendance = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // 🧠 CHANGED - whenever page changes, fetch next batch
  useEffect(() => {
    if (page > 1) fetchUserData();
  }, [page]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{paddingBottom: '40px'}}>
      {!userData?.face ? (
        <div className="text-center mt-4">
          <h2 className="mb-3">Add your face to use the attendance system</h2>
          <FaceCapture onSuccess={() => setRefreshKey((prev) => prev + 1)} />
        </div>
      ) : (
        <>
          <TopStatusSection
            todayStatus={todayStatus}
            presentDays={presentDays}
            absentDays={absentDays}
            balanceLeave={balanceLeave}
          />
          <MarkAttendanceSection
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            todayStatus={todayStatus}
          />

          {/* 🧠 CHANGED - pass paginated attendance */}
          <AttendanceHistoryTable key={refreshKey} attendance={attendance} />

          {/* 🧠 CHANGED - Load more button */}
          {hasMore && (
            <div className="text-center my-3">
              <button className="btn btn-outline-primary" onClick={loadMoreAttendance}>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Attendance;
