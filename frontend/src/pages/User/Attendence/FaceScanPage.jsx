import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { toast } from "react-toastify";
import "./FaceScanPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../../utils/tokenService"; // Adjust the import path as necessary

const FaceScanPage = () => {
  const webcamRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [failed, setFailed] = useState(false);
  const { type } = useParams(); // 👈 this gives you "check-in" or "check-out"
  const navigate = useNavigate();

  const captureMode = type === "check-in" ? "check-in" : "check-out";

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isScanning) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      captureAndSend(); // Start capture while progress animates

      return () => clearInterval(progressInterval);
    }
  }, [isScanning]);

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
        toast.error("Failed to capture image.");
        setFailed(true);
        return;
      }

      const endpoint =
        captureMode === "check-in"
          ? "/api/user/attendance/check-in"
          : "/api/user/attendance/check-out";

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
        toast.success(
          `${captureMode === "check-in" ? "Check-in" : "Check-out"} successful!`
        );
        setScanComplete(true);
        setTimeout(() => {
          window.location.href = "/user_dashboard/attendance";
        }, 1500);
      } else {
        toast.error(res.data?.message || "Failed to mark attendance.");
        setFailed(true);
        setTimeout(() => {
          // window.location.href = "/user_dashboard/attendance";
          navigate(-1);
        }, 1500);
      }
    } catch (err) {
      toast.error("Error during attendance.");
      setFailed(true);
      setTimeout(() => {
        // window.location.href = "/user_dashboard/attendance";
        navigate(-1);
      }, 1500);
    }
  };

  return (
    <div className="face-scan-container">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="video-frame"
      />

      <div className="overlay">
        <div className="face-recognition-text">
          <h2>Face Recognition</h2>
          <p>Please look into the camera</p>
        </div>

        <div className="face-box">
          {scanComplete ? (
            <div className="success-check-mark" />
          ) : failed ? (
            <div className="fail-mark">✖</div>
          ) : isScanning ? (
            <div className="scan-line-container">
              <div className="scan-line" />
            </div>
          ) : null}
        </div>

        <div></div>
        {isScanning && (
          <p style={{ color: "white", marginTop: "6px" }}>
            {failed ? "Fail" : `${progress}% recognised`}
          </p>
        )}

        {isScanning && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {!isScanning && !scanComplete && !failed && (
          <button className="start-button" onClick={startScan}>
            Start
          </button>
        )}
      </div>
    </div>
  );
};

export default FaceScanPage;
