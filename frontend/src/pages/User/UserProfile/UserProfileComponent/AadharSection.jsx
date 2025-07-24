import React, { useRef } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../../../utils/tokenService'; // Assuming you have a utility function to get the token

const AadharSection = ({ 
  user, 
  setUser, 
  setShowCropModal, 
  setPreviewUrl, 
  setCrop,
  isAadharFront,
  setIsAadharFront
}) => {
  const aadhar_front_image_input_ref = useRef();
  const aadhar_back_image_input_ref = useRef();

  const handleAadharFrontCroppedImage = async (blob) => {
    const token = await getToken();
    try {
      const formData = new FormData();
      const file = new File([blob], "cropped-aadhar-front.jpeg", {
        type: "image/jpeg",
      });
      formData.append("image", file);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/upload/aadhar-front-image`,
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
          aadhar_front_image: response.data.user.aadhar_front_image,
        }));
        toast.success("Aadhar front image uploaded successfully!");
        setShowCropModal(false);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    }
  };

  const handleAadharBackCroppedImage = async (blob) => {
    const token = await getToken();
    try {
      const formData = new FormData();
      const file = new File([blob], "cropped-aadhar-back.jpeg", {
        type: "image/jpeg",
      });
      formData.append("image", file);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/upload/aadhar-back-image`,
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
          aadhar_back_image: response.data.user.aadhar_back_image,
        }));
        toast.success("Aadhar back image uploaded successfully!");
        setShowCropModal(false);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    }
  };

  const handlePdfUpload = async (file, isFront) => {
    const token = await getToken();
    try {
      const formData = new FormData();
      formData.append("image", file);

      const endpoint = isFront 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/user/upload/aadhar-front-image`
        : `${process.env.REACT_APP_BACKEND_URL}/api/user/upload/aadhar-back-image`;

      const response = await axios({
        method: 'post',
        url: endpoint,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      if (response.data.user) {
        setUser((prev) => ({
          ...prev,
          [isFront ? 'aadhar_front_image' : 'aadhar_back_image']: response.data.user[isFront ? 'aadhar_front_image' : 'aadhar_back_image'],
        }));
        toast.success(`Aadhar ${isFront ? 'front' : 'back'} document uploaded successfully!`);
        setShowCropModal(false);
        setPreviewUrl(null);
        setIsAadharFront(false);
      }
    } catch (error) {
      console.error("Upload error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      if (error.response?.status === 413) {
        toast.error("File size too large. Please upload a smaller file.");
      } else if (error.response?.status === 415) {
        toast.error("Unsupported file type. Please upload a PDF or image file.");
      } else {
        toast.error(error.response?.data?.message || "Failed to upload document");
      }
    }
  };

  const handleDeleteAadharFrontImage = async () => {
    const token = await getToken();
    try {
      console.log("Attempting to delete Aadhar front image...");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/delete/aadhar-front-image`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Delete response:", response);

      if (response.data.user) {
        setUser((prev) => ({
          ...prev,
          aadhar_front_image: null,
        }));
        toast.success("Aadhar front document deleted successfully!");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Delete error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || "Failed to delete document");
    }
  };

  const handleDeleteAadharBackImage = async () => {
    const token = await getToken();
    try {
      console.log("Attempting to delete Aadhar back image...");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/delete/aadhar-back-image`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Delete response:", response);

      if (response.data.user) {
        setUser((prev) => ({
          ...prev,
          aadhar_back_image: null,
        }));
        toast.success("Aadhar back document deleted successfully!");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Delete error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || "Failed to delete document");
    }
  };

  const handleAadharFrontImageChange = (e) => {
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
        handlePdfUpload(file, true);
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
        setIsAadharFront(true);
        e.target.value = ''; // Clear the file input after setting preview
      };
      reader.onerror = () => {
        toast.error("Error reading file");
        e.target.value = ''; // Clear the file input on error
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadharBackImageChange = (e) => {
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
        handlePdfUpload(file, false);
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
        setIsAadharFront(false);
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
        <h1>Aadhar Card</h1>
      </div>
      <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
        <div className="flex flex-col profile-content-box">
          <dt>Aadhar No.</dt>
          <dd>{user.aadhar_number}</dd>
        </div>
        <div className="flex flex-col profile-content-box">
          <dt>Name</dt>
          <dd>{user.full_Name}</dd>
        </div>
        <div className="flex flex-col profile-content-box position-relative">
          <dt>Aadhar Card Documents</dt>
          <div className="d-flex flex-column gap-3">
            {/* Front Image Section */}
          <dd className="d-flex align-items-center gap-2">
              <span className="text-muted me-2">Front:</span>
              {user.aadhar_front_image ? (
              <>
                <span className="text-success">
                  <i className="fas fa-check-circle"></i> Uploaded
                </span>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        const url = `${process.env.REACT_APP_BACKEND_URL}${user.aadhar_front_image}`;
                        // Open PDF in a new tab
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                  >
                      View Front
                  </button>
                    {/* <button 
                    className="btn btn-primary btn-sm"
                      onClick={() => aadhar_front_image_input_ref.current.click()}
                  >
                    Update
                    </button> */}
                    {/* <button 
                    className="btn btn-outline-danger btn-sm"
                      onClick={handleDeleteAadharFrontImage}
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
                    onClick={() => aadhar_front_image_input_ref.current.click()}
                    className="btn btn-primary btn-sm"
                  >
                    Upload Front
                  </button>
                </>
              )}
            </dd>

            {/* Back Image Section */}
            <dd className="d-flex align-items-center gap-2">
              <span className="text-muted me-2">Back:</span>
              {user.aadhar_back_image ? (
                <>
                  <span className="text-success">
                    <i className="fas fa-check-circle"></i> Uploaded
                  </span>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        const url = `${process.env.REACT_APP_BACKEND_URL}${user.aadhar_back_image}`;
                        // Open PDF in a new tab
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      View Back
                    </button>
                    {/* <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => aadhar_back_image_input_ref.current.click()}
                    >
                      Update
                    </button> */}
                    {/* <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleDeleteAadharBackImage}
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
                    onClick={() => aadhar_back_image_input_ref.current.click()}
                  className="btn btn-primary btn-sm"
                >
                    Upload Back
                </button>
              </>
            )}
            </dd>
          </div>

          {/* Hidden Input Fields */}
          <input 
            ref={aadhar_front_image_input_ref}
            type="file"
            onChange={handleAadharFrontImageChange}
            accept="image/*,.pdf"
            className="d-none"
          />
            <input 
            ref={aadhar_back_image_input_ref}
              type="file"
            onChange={handleAadharBackImageChange}
            accept="image/*,.pdf"
              className="d-none"
            />
        </div>
      </div>
    </div>
  );
};

export default AadharSection; 