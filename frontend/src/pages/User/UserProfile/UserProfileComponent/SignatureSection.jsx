import React, { useRef } from 'react';
import { FaSignature } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import CropModal from '../CropModal';

const SignatureSection = ({ 
  user, 
  setUser,
  token
}) => {
  const [showCropModal, setShowCropModal] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [crop, setCrop] = React.useState({
    unit: 'px',
    x: 0,
    y: 0,
    width: 200,
    height: 150
  });
  const signature_input_ref = useRef();

  const handleSignatureCroppedImage = async (blob) => {
    try {
      const formData = new FormData();
      const file = new File([blob], "cropped-signature.jpeg", {
        type: "image/jpeg",
      });
      formData.append("image", file);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload/signature`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.user) {
        setUser((prev) => ({
          ...prev,
          signature: response.data.user.signature,
        }));
        toast.success("Signature uploaded successfully!");
        setShowCropModal(false);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload signature");
    }
  };

  const handleSignatureChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setCrop({
          unit: 'px',
          x: 0,
          y: 0,
          width: 200,
          height: 150
        });
        setShowCropModal(true);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSignature = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/delete/signature`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.user) {
        setUser((prev) => ({
          ...prev,
          signature: null,
        }));
        toast.success("Signature deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete signature");
    }
  };

  return (
    <>
      <div className="card shadow-sm border-0">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 mb-md-4">
            <h4 className="card-title mb-2 mb-md-0 fw-bold text-primary">
              <FaSignature className="me-2" />
              Signature
            </h4>
            <div className="d-flex gap-2">
              {user.signature ? (
                <>
                  <button
                    onClick={() => signature_input_ref.current.click()}
                    className="btn btn-primary btn-sm"
                  >
                    Change
                  </button>
                  <button
                    onClick={handleDeleteSignature}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signature_input_ref.current.click()}
                  className="btn btn-primary btn-sm"
                >
                  Add Signature
                </button>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="signature-preview-container" style={{ 
                minHeight: '200px', 
                width: '100%', 
                border: '1px dashed #dee2e6',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8f9fa'
              }}>
                {user.signature ? (
                  <img
                    src={user.signature.startsWith('http') ? user.signature : `${process.env.REACT_APP_BACKEND_URL}${user.signature}`}
                    alt="Signature"
                    className="signature-preview"
                    style={{ 
                      maxHeight: '150px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                ) : (
                  <div className="no-signature-placeholder">
                    <FaSignature size={48} className="text-muted" />
                    <p className="text-muted mt-2">No signature uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <input
          ref={signature_input_ref}
          type="file"
          onChange={handleSignatureChange}
          accept="image/*"
          className="d-none"
        />
      </div>

      <CropModal
        showModal={showCropModal}
        imageUrl={previewUrl}
        onClose={() => {
          setShowCropModal(false);
          setPreviewUrl(null);
        }}
        onSave={handleSignatureCroppedImage}
        imageType="signature"
      />
    </>
  );
};

export default SignatureSection;