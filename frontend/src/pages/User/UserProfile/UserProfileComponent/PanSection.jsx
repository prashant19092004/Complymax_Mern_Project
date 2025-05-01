import React, { useRef } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';

const PanSection = ({ 
  user, 
  setUser,
  addPan,
  setShowCropModal,
  setPreviewUrl,
  setCrop,
  token,
  setIsPanImage
}) => {
  const pan_image_input_ref = useRef();

  const handlePanCroppedImage = async (blob) => {
    try {
      const formData = new FormData();
      const file = new File([blob], "cropped-pan-image.jpeg", {
        type: "image/jpeg",
      });
      formData.append("image", file);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload/pan-image`,
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
          pan_image: response.data.user.pan_image,
        }));
        toast.success("Pan card image uploaded successfully!");
        setShowCropModal(false);
        setPreviewUrl(null);
        setIsPanImage(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    }
  };

  const handleDeletePanImage = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/delete/pan-image`,
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
        toast.success("Pan card image deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  const handlePanImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setCrop(null);
        setShowCropModal(true);
        setIsPanImage(true);
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
          <dt>Pan Card Image</dt>
          <dd className="d-flex align-items-center gap-2">
            {user.pan_image ? (
              <>
                <span className="text-success">
                  <i className="fas fa-check-circle"></i> Uploaded
                </span>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => window.open(`${process.env.REACT_APP_BACKEND_URL}${user.pan_image}`, '_blank')}
                  >
                    View Image
                  </button>
                  <button 
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
                  </button>
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
              accept="image/*"
              className="d-none"
            />
          </dd>
        </div>
      </div>
    </div>
  );
};

export default PanSection;