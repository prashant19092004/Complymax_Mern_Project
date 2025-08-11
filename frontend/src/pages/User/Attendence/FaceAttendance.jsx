import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, CameraResultType } from "@capacitor/camera";
import Webcam from "react-webcam";
import { isPlatform } from "@ionic/react";
import axios from "axios";

const FaceAttendance = () => {
  const { type } = useParams(); // type = "checkin" or "checkout"
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const webcamRef = useRef(null);

  const isMobile = isPlatform("hybrid");

  useEffect(() => {
    if (isMobile) {
      openMobileCamera();
    }
  }, []);

  const openMobileCamera = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      quality: 90,
    });
    setImage(`data:image/jpeg;base64,${photo.base64String}`);
  };

  const handleCaptureWeb = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setIsSubmitting(true);
    try {
      await axios.post(`/api/attendance/${type}`, {
        image,
        location: {
          latitude: 0,
          longitude: 0,
        },
      });
      alert(`${type === "checkin" ? "Check-in" : "Check-out"} successful!`);
      navigate("/");
    } catch (err) {
      alert(`${type === "checkin" ? "Check-in" : "Check-out"} failed.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.close} onClick={() => navigate("/user_dashboard/attendance")}>×</button>
        <h2>{type === "checkin" ? "Check In" : "Check Out"}</h2>

        {isMobile ? (
          image ? (
            <img src={image} alt="Preview" style={styles.preview} />
          ) : (
            <p>Opening Camera...</p>
          )
        ) : (
          <>
            {!image && (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                style={styles.webcam}
              />
            )}
            {image && <img src={image} alt="Preview" style={styles.preview} />}
          </>
        )}

        <div style={styles.controls}>
          {!isMobile && !image && (
            <button onClick={handleCaptureWeb}>Capture</button>
          )}
          {image && (
            <button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
          <button onClick={() => navigate("/user_dashboard/attendance")}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.85)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    position: "relative",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    maxWidth: "90%",
    width: 400,
    textAlign: "center",
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "transparent",
    color: "black",
    fontSize: 24,
    border: "none",
    cursor: "pointer",
  },
  webcam: {
    width: "100%",
    borderRadius: 10,
  },
  preview: {
    width: "100%",
    borderRadius: 10,
  },
  controls: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-around",
  },
};

export default FaceAttendance;
