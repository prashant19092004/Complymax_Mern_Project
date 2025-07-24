import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { getToken } from '../../../utils/tokenService';

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: 'user',
};

const FaceCapture = ({ onSuccess }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isApp, setIsApp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsApp(Capacitor.isNativePlatform());
  }, []);

  const capture = async () => {
    if (isApp) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          resultType: CameraResultType.Base64,
        });
        setCapturedImage(`data:image/jpeg;base64,${image.base64String}`);
      } catch (error) {
        toast.error('Camera access denied or cancelled.');
      }
    } else {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  };

  const uploadFace = async () => {
    const token = await getToken();
    setShowSpinner(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/attendance/upload-face`,
        { image: capturedImage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success('Face added successfully!');
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.data.message || 'Failed to upload face.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error uploading face.');
    } finally {
      setShowSpinner(false);
      setShowModal(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-start mt-3">
      <div className="card p-3 shadow w-100" style={{ maxWidth: '500px' }}>
        <h5 className="text-center mb-2">Face Capture</h5>

        {!capturedImage ? (
          <div className="text-center">
            {!isApp && (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="img-thumbnail w-100"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
            )}
            <button
              onClick={capture}
              className="btn btn-primary mt-3 w-100 d-flex justify-content-center align-items-center"
            >
              Capture Face
            </button>
          </div>
        ) : (
          <div className="text-center">
            <img
              src={capturedImage}
              alt="Captured"
              className="img-thumbnail mb-3 w-100"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-success w-50 me-2"
                onClick={() => setShowModal(true)}
              >
                {showSpinner && <span className="spinner-border spinner-border-sm me-2" />}
                Upload
              </button>
              <button
                onClick={() => setCapturedImage(null)}
                className="btn btn-secondary w-50"
              >
                Retake
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Upload</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to upload this face for attendance?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={uploadFace}>
                  {showSpinner && <span className="spinner-border spinner-border-sm me-2" />}
                  Confirm Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceCapture;
