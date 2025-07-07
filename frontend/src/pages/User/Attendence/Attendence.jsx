import React, { useEffect, useState, useRef } from 'react';
import TopStatusSection from '../../../components/AttendanceDashboard/TopStatusSection';
import MarkAttendanceSection from '../../../components/AttendanceDashboard/MarkAttendanceSection';
import AttendanceHistoryTable from '../../../components/AttendanceDashboard/AttendanceHistoryTable';
import FaceCapture from './FaceCapture';
import { toast } from 'react-toastify';
import axios from 'axios';
import Webcam from 'react-webcam';

const Attendance = () => {
  const token = localStorage.getItem('token');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState('check-in'); // 'check-in' or 'check-out'
  const webcamRef = useRef(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [presentDays, setPresentDays] = useState(0);
  const [balanceLeave, setBalanceLeave] = useState(0);

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

const calculateBalanceLeave = (userData) => {
  const earnedLeave = userData?.attendance[0]?.establishment?.earnedLeave || 0;
  const casualLeave = userData?.attendance[0]?.establishment?.casualLeave || 0;
  const medicalLeave = userData?.attendance[0]?.establishment?.medicalLeave || 0;
  const leaveTaken = userData?.leaveTaken || 0; 


  const totalAllocatedLeave = earnedLeave + casualLeave + medicalLeave;
  const balanceLeave = totalAllocatedLeave - leaveTaken;

  return balanceLeave >= 0 ? balanceLeave : 0;
};



  const handleCheckIn = () => {
    setCaptureMode('check-in');
    setIsCapturing(true);
  };

  const handleCheckOut = () => {
    setCaptureMode('check-out');
    setIsCapturing(true);
  };

  const captureAndSend = async () => {
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

      const imageSrc = webcamRef.current?.getScreenshot();

      if (!imageSrc) {
        toast.error('Failed to capture image.');
        setIsCapturing(false);
        return;
      }

      const endpoint =
        captureMode === 'check-in'
          ? '/api/user/attendance/check-in'
          : '/api/user/attendance/check-out';

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
        toast.error(res.data?.message || `${captureMode === 'check-in' ? 'Check-in' : 'Check-out'} failed.`);
      }
    } catch (err) {
      if (err.code === 1) {
        toast.error('Location permission denied. Please enable GPS.');
      } else if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || `Server error during ${captureMode}.`;
        toast.error(message);
      } else {
        toast.error(`An unexpected error occurred during ${captureMode}.`);
      }
      console.error(`${captureMode} error:`, err);
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/attendance/user-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        setUserData(response.data.userData);
        setCheckedIn(isCheckedInToday(response?.data?.userData?.attendance));
        setPresentDays(getMonthlyPresentCount(response?.data?.userData?.attendance));
        setBalanceLeave(calculateBalanceLeave(response?.data?.userData));
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching user data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, refreshKey]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Webcam Modal */}
      {isCapturing && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3 text-center">
              <h5>Capture Face for {captureMode === 'check-in' ? 'Check-In' : 'Check-Out'}</h5>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="img-thumbnail mb-3"
                width="100%"
              />
              <button
                className="btn btn-primary w-100"
                onClick={captureAndSend}
              >
                Submit {captureMode === 'check-in' ? 'Check-In' : 'Check-Out'}
              </button>
              <button
                className="btn btn-secondary w-100 mt-2"
                onClick={() => setIsCapturing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main UI */}
      {!userData?.face ? (
        <div className="text-center mt-4">
          <h2 className="mb-3">Add your face to use the attendance system</h2>
          <FaceCapture onSuccess={() => setRefreshKey((prev) => prev + 1)} />
        </div>
      ) : (
        <>
          <TopStatusSection checkedIn={checkedIn} presentDays={presentDays} balanceLeave={balanceLeave} />
          <MarkAttendanceSection onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />
          <AttendanceHistoryTable key={refreshKey} attendance={userData.attendance} />
        </>
      )}
    </div>
  );
};

export default Attendance;
