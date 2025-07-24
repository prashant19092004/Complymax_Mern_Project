import React, { useRef } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../../../utils/tokenService';

const PanSection = ({ 
  user, 
  setUser,
  addPan,
  setShowCropModal,
  setPreviewUrl,
  setCrop,
  setIsPanImage,
  handlePanPdfUpload
}) => {
  const pan_image_input_ref = useRef();

  const handleDeletePanImage = async () => {
    const token = await getToken();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/delete/pan-image`,
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
          pan_image: null,
        }));
        toast.success("Pan card document deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  const handlePanImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("File size too large. Please upload a file smaller than 5MB.");
        e.target.value = ''; // Clear the file input
        return;
      }

      // Check if file is PDF
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        handlePanPdfUpload(file);
        e.target.value = ''; // Clear the file input
        return;
      }

      // For images, proceed with cropping
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
        setIsPanImage(true);
        e.target.value = ''; // Clear the file input after setting preview
      };
      reader.onerror = () => {
        toast.error("Error reading file");
        e.target.value = ''; // Clear the file input on error
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='id_sec'>
      <div className='pan_heading'>
        <h1>Pan Card</h1>
        <button onClick={addPan}>{user.pan_added ? 'Change' : 'Add'}</button>
      </div>
      <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
        <div className="flex flex-col profile-content-box">
          <dt>Pan No.</dt>
          <dd>{user.pan_number}</dd>
        </div>
        <div className="flex flex-col profile-content-box">
          <dt>Name</dt>
          <dd>{user.pan_name}</dd>
        </div>
        <div className="flex flex-col profile-content-box position-relative">
          <dt>Pan Card Document</dt>
          <dd className="d-flex align-items-center gap-2">
            {user.pan_image ? (
              <>
                <span className="text-success">
                  <i className="fas fa-check-circle"></i> Uploaded
                </span>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      const url = `${process.env.REACT_APP_BACKEND_URL}${user.pan_image}`;
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    View Document
                  </button>
                  {/* <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => pan_image_input_ref.current.click()}
                  >
                    Update
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleDeletePanImage}
                  >
                    <MdDeleteOutline size={18} />
                  </button> */}
                </div>
              </>
            ) : (
              <>
                <span className="text-warning">
                  <i className="fas fa-exclamation-circle"></i> Not uploaded
                </span>
                <button 
                  onClick={() => pan_image_input_ref.current.click()}
                  className="btn btn-primary btn-sm"
                >
                  Upload Now
                </button>
              </>
            )}
            <input 
              ref={pan_image_input_ref}
              type="file"
              onChange={handlePanImageChange}
              accept="image/*,.pdf"
              className="d-none"
            />
          </dd>
        </div>
      </div>
    </div>
  );
};

export default PanSection;