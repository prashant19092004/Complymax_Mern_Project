// Modernized Check-In / Check-Out UI using Face Recognition

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { getToken } from '../../../utils/tokenService';
import axios from 'axios';
import { toast } from 'react-toastify';

const FaceScanner = ({ mode = 'check-in', onClose, onSuccess }) => {
  const [isApp, setIsApp] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    setIsApp(Capacitor.isNativePlatform());
  }, []);

  useEffect(() => {
    if (!imageSrc) {
      let i = 0;
      const interval = setInterval(() => {
        i += 10;
        setProgress(i);
        if (i >= 90) clearInterval(interval);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [imageSrc]);

  const captureImage = async () => {
    try {
      if (isApp) {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
          quality: 90,
        });
        setImageSrc(`data:image/jpeg;base64,${photo.base64String}`);
      } else {
        const screenshot = webcamRef.current.getScreenshot();
        setImageSrc(screenshot);
      }
    } catch (err) {
      toast.error('Camera access failed.');
    }
  };

  const captureAndSend = async () => {
    setLoading(true);
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      );

      const token = await getToken();
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/attendance/${mode}`,
        {
          image: imageSrc,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(`${mode === 'check-in' ? 'Check-in' : 'Check-out'} successful!`);
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.data.message || 'Failed to submit.');
      }
    } catch (err) {
      toast.error('Submission error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full max-w-sm bg-black rounded-2xl overflow-hidden shadow-lg">
        <div className="relative w-full h-80 bg-black">
          {!imageSrc ? (
            isApp ? (
              <div className="w-full h-full flex items-center justify-center text-white text-sm">
                Tap capture to open camera
              </div>
            ) : (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
          )}

          {/* Face frame overlay */}
          <div className="absolute inset-12 border-4 border-green-500 rounded-xl pointer-events-none"></div>

          {/* Progress */}
          {!imageSrc && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-white mt-1 text-center">{progress}% recognised</p>
            </div>
          )}
        </div>

        <div className="p-4">
          {!imageSrc ? (
            <button
              className="btn btn-primary w-full"
              onClick={captureImage}
              disabled={loading}
            >
              Capture Face
            </button>
          ) : (
            <>
              <button
                className="btn btn-success w-full mb-2"
                onClick={captureAndSend}
                disabled={loading}
              >
                {loading ? 'Submitting...' : `Submit ${mode === 'check-in' ? 'Check-In' : 'Check-Out'}`}
              </button>
              <button
                className="btn btn-secondary w-full"
                onClick={() => setImageSrc(null)}
                disabled={loading}
              >
                Retake
              </button>
            </>
          )}
          <button className="btn btn-outline-light w-full mt-2" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceScanner;
