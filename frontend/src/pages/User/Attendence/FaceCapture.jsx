import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../utils/tokenService"; // Adjust import path

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: "user",
};

const FaceCapture = ({ onSuccess }) => {
  const webcamRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [failed, setFailed] = useState(false);

  const navigate = useNavigate();

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      captureAndUpload();

      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const captureAndUpload = async () => {
    try {

      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        toast.error("Failed to capture image.");
        setFailed(true);
        return;
      }

      const token = await getToken();

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/attendance/upload-face`,
        {
          image: imageSrc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success("Face added successfully!");
        setScanComplete(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          navigate("/user_dashboard/attendance");
        }, 1500);
      } else {
        toast.error(res.data?.message || "Failed to upload face.");
        setFailed(true);
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading face.");
      setFailed(true);
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    }
  };

  return (
    <div className="face-scan-container1">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="video-frame"
      />

      <div className="overlay">
        <div className="face-recognition-text">
          <h2>Face Capture</h2>
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

export default FaceCapture;
