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
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); // 👈 new state
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

  function getTodayStatus(userData) {
    const today = new Date();
    const isSameDate = (dateStr) => {
      const d = new Date(dateStr);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    };

    const isHoliday = userData.attendance?.establishment?.holidays?.some(holiday =>
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

    const isCheckedIn = userData.attendance?.some(record =>
      isSameDate(record.checkInTime)
    );
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

  const calculateBalanceLeave = (userData) => {
    const earnedLeave = userData?.attendance[0]?.establishment?.earnedLeave || 0;
    const casualLeave = userData?.attendance[0]?.establishment?.casualLeave || 0;
    const medicalLeave = userData?.attendance[0]?.establishment?.medicalLeave || 0;
    const leaveTaken = userData?.leaveTaken || 0;
    const totalAllocatedLeave = earnedLeave + casualLeave + medicalLeave;
    return Math.max(totalAllocatedLeave - leaveTaken, 0);
  };

  const handleCheckIn = () => {
    // setCaptureMode('check-in');
    // setIsCapturing(true);
    navigate('/face-attendance/check-in');
  };

  const handleCheckOut = () => {
    // setCaptureMode('check-out');
    // setIsCapturing(true);
    navigate('/face-attendance/check-out');
  };

  const captureAndSend = async () => {
    setProcessing(true); // 👈 Start processing spinner
    try {
      const getLocation = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });

      const position = await getLocation();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      let imageSrc;
      if (isApp) {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Base64,
          quality: 90,
          source: CameraSource.Camera,
          allowEditing: false,
          saveToGallery: false,
        });
        imageSrc = `data:image/jpeg;base64,${photo.base64String}`;
      } else {
        imageSrc = webcamRef.current?.getScreenshot();
      }

      if (!imageSrc) {
        toast.error('Failed to capture image.');
        return;
      }

      const endpoint = captureMode === 'check-in'
        ? '/api/user/attendance/check-in'
        : '/api/user/attendance/check-out';

      const token = await getToken();
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}${endpoint}`,
        {
          image: imageSrc,
          location: { latitude, longitude },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success(`${captureMode === 'check-in' ? 'Check-in' : 'Check-out'} successful!`);
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error(res.data?.message || 'Failed to mark attendance.');
      }
    } catch (err) {
      if (err.code === 1) {
        toast.error('Location permission denied. Please enable GPS.');
      } else if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Server error during attendance.');
      } else {
        toast.error('Unexpected error during attendance.');
      }
    } finally {
      setProcessing(false); // 👈 Stop spinner
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/attendance/user-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) throw new Error(response.data.message);

        const data = response.data.userData;
        setUserData(data);
        setCheckedIn(isCheckedInToday(data.attendance));
        setTodayStatus(getTodayStatus(data));
        setPresentDays(getMonthlyPresentCount(data.attendance));
        setAbsentDays(getMonthlyAbsentCount(data.attendance));
        setBalanceLeave(calculateBalanceLeave(data));
      } catch (error) {
        toast.error('Error fetching user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [refreshKey]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isCapturing && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3 text-center">
              <h5>Capture Face for {captureMode === 'check-in' ? 'Check-In' : 'Check-Out'}</h5>

              {!isApp && (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="img-thumbnail mb-3"
                  width="100%"
                />
              )}

              {processing ? (
                <div className="d-flex justify-content-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Processing...</span>
                  </div>
                </div>
              ) : (
                <>
                  <button className="btn btn-primary w-100" onClick={captureAndSend}>
                    Submit {captureMode === 'check-in' ? 'Check-In' : 'Check-Out'}
                  </button>
                  <button className="btn btn-secondary w-100 mt-2" onClick={() => setIsCapturing(false)}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
          <AttendanceHistoryTable key={refreshKey} attendance={userData.attendance} />
        </>
      )}
    </div>
  );
};

export default Attendance;
