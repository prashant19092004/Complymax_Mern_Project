import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import "../../../component1/UserDashboard/style.css";
import "../../../component1/Home/style.css";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import { FaRegEdit, FaIdCard, FaCalendar, FaUser, FaPhone, FaMapMarkerAlt, FaGlobe, FaEnvelope } from "react-icons/fa";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import default_pic from "../../../assets/Default_pfp.svg.png";
import "react-image-crop/dist/ReactCrop.css";
import CropModal from "./CropModal";
import AadharSection from './UserProfileComponent/AadharSection';
import EducationSection from './UserProfileComponent/EducationSection';
import ExperienceSection from './UserProfileComponent/ExperienceSection';
import PanSection from './UserProfileComponent/PanSection';
import AccountSection from './UserProfileComponent/AccountSection';
import SignatureSection from './UserProfileComponent/SignatureSection';
import { toast } from "react-toastify";

const UserProfile = () => {
    const token = localStorage.getItem("token");
  const navigate = useNavigate();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const profile_pic_input_ref = useRef();
  const certificate_input_ref = useRef();
    const [showCropModal, setShowCropModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPanImage, setIsPanImage] = useState(false);
  const [isAccountImage, setIsAccountImage] = useState(false);
  const [isAadharFront, setIsAadharFront] = useState(false);
  const [currentEducationId, setCurrentEducationId] = useState(null);
  const [isExperience, setIsExperience] = useState(false);
    const [crop, setCrop] = useState({
    unit: 'px',
      x: 0,
      y: 0,
      width: 200,
    height: 200
  });
  const [isProfilePic, setIsProfilePic] = useState(false);

  const addPan = () => {
    navigate("/user_dashboard/add_pan");
  };

  const addAccount = () => {
    navigate("/user_dashboard/add_account");
  };

  const addUan = () => {
    navigate("/user_dashboard/add_uan_esic");
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
  const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        toast.warning('Please upload profile picture in JPG or PNG format only');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setIsProfilePic(true);
  setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicCroppedImage = async (blob) => {
    try {
      const formData = new FormData();
      const file = new File([blob], "profile-pic.jpeg", {
        type: "image/jpeg",
      });
      formData.append("image", file);

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/upload/profile-pic`,
        formData,
        {
      headers: {
            "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
        }
      );
      if (res.data.user) {
      toast.success("Profile picture uploaded successfully!");
        setUser(prev => ({
          ...prev,
          profilePic: res.data.user.profilePic
        }));
        setShowCropModal(false);
        setPreviewUrl(null);
        setIsProfilePic(false);
      }
  } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Error uploading profile picture");
    }
  };

  const handlePanCroppedImage = async (blob) => {
  try {
    const formData = new FormData();
      const file = new File([blob], "cropped-pan-image.jpeg", {
        type: "image/jpeg",
      });
      formData.append("image", file);

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/user/upload/pan-image`,
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

const handleAadharFrontCroppedImage = async (blob) => {
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

const handleAadharPdfUpload = async (file, isFront) => {
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

const handleAccountCroppedImage = async (blob) => {
  try {
    const formData = new FormData();
      const file = new File([blob], "cropped-account-image.jpeg", {
        type: "image/jpeg",
      });
      formData.append("image", file);

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/user/upload/account-image`,
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
          account_image: response.data.user.account_image,
      }));
        toast.success("Account image uploaded successfully!");
      setShowCropModal(false);
      setPreviewUrl(null);
      setIsAccountImage(false);
    }
  } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
  }
};

  const handleAadharCroppedImage = async (blob) => {
    if (isAadharFront) {
      return handleAadharFrontCroppedImage(blob);
          } else {
      return handleAadharBackCroppedImage(blob);
  }
  };

const handleCertificateCroppedImage = async (blob) => {
  try {
    const formData = new FormData();
      const file = new File([blob], "certificate-image.jpeg", {
      type: "image/jpeg",
    });
      formData.append("certificate", file);
      formData.append("id", currentEducationId);
      formData.append("type", isExperience ? "experience" : "education");

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/user/upload/certificate`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.user) {
      setUser(response.data.user);
        toast.success(
          `${isExperience ? "Experience" : "Education"} certificate uploaded successfully!`
        );
      setShowCertificateModal(false);
      setPreviewUrl(null);
    }
  } catch (error) {
    console.error("Upload error:", error);
      toast.error("Failed to upload certificate");
  }
};

const handlePanPdfUpload = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/user/upload/pan-image`,
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
        pan_image: response.data.user.pan_image,
      }));
      toast.success("Pan card document uploaded successfully!");
      setShowCropModal(false);
      setPreviewUrl(null);
      setIsPanImage(false);
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

const handleEducationPdfUpload = async (file, educationId) => {
  try {
    const formData = new FormData();
    formData.append("certificate", file);
    formData.append("id", educationId);
    formData.append("type", "education");

    const response = await axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/user/upload/certificate`,
      data: formData,
            headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    if (response.data.user) {
      setUser(response.data.user);
      toast.success("Education certificate uploaded successfully!");
      setShowCertificateModal(false);
      setPreviewUrl(null);
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

const handleExperiencePdfUpload = async (file, experienceId) => {
  try {
    const formData = new FormData();
    formData.append("certificate", file);
    formData.append("id", experienceId);
    formData.append("type", "experience");

    const response = await axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/user/upload/certificate`,
      data: formData,
        headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
        },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    if (response.data.user) {
      setUser(response.data.user);
      toast.success("Experience certificate uploaded successfully!");
      setShowCertificateModal(false);
      setPreviewUrl(null);
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-wrapper">
    <div className="container-fluid py-2 py-sm-3 py-md-4 px-2 px-sm-3">
      {/* Profile Header Section */}
      <div className="row mb-2 mb-sm-3 mb-md-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-2 p-sm-3 p-md-4">
              <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start">
                <div className="position-relative mb-2 mb-sm-3 mb-md-0 me-md-4">
                  <div className="profile-pic-container">
              <img
                id="user-avatar"
                        src={user.profilePic ? `${process.env.REACT_APP_BACKEND_URL}${user.profilePic}` : default_pic}
                alt="Avatar"
                      className="rounded-circle profile-pic"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <div
                        onClick={() => {
                          if (profile_pic_input_ref.current) {
                            profile_pic_input_ref.current.click();
                          }
                        }}
                        className="position-absolute end-0 bottom-0 rounded-circle p-1 p-sm-2 bg-light shadow-sm edit-profile-btn"
                        style={{ cursor: 'pointer' }}
                    >
                      <div className="bg-primary rounded-circle p-1 p-sm-2">
                        <MdEdit className="text-light" size={16} />
            </div>
          </div>
                      <input 
                        ref={profile_pic_input_ref}
                        type="file"
                        onChange={onFileChange}
                        accept="image/jpeg,image/png,image/jpg"
                        className="d-none"
                      />
        </div>
      </div>
                <div className="profile-info">
                    <h2>{user.full_Name}</h2>
                    <p>{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
              </div>

      {/* Document Sections */}
      <div className="row g-3 g-md-4">
        <div className="col-12">
            <AadharSection user={user} setUser={setUser} setShowCropModal={setShowCropModal} setPreviewUrl={setPreviewUrl} setCrop={setCrop} token={token} isAadharFront={isAadharFront} setIsAadharFront={setIsAadharFront} />
        </div>
        <div className="col-12">
        <PanSection 
          user={user}
              setUser={setUser} 
          addPan={addPan}
              setShowCropModal={setShowCropModal} 
          setPreviewUrl={setPreviewUrl}
          setCrop={setCrop}
              token={token} 
          setIsPanImage={setIsPanImage}
              handlePanPdfUpload={handlePanPdfUpload}
        />
        </div>
        <div className="col-12">
            <AccountSection user={user} setUser={setUser} addAccount={addAccount} setShowCropModal={setShowCropModal} setPreviewUrl={setPreviewUrl} setCrop={setCrop} token={token} setIsAccountImage={setIsAccountImage} />
        </div>
        <div className="col-12">
        <EducationSection 
          user={user}
              setUser={setUser} 
              token={token}
              handleEducationPdfUpload={handleEducationPdfUpload}
        />
        </div>
        <div className="col-12">
        <ExperienceSection 
          user={user}
              setUser={setUser} 
              token={token}
              handleExperiencePdfUpload={handleExperiencePdfUpload}
        />
        </div>
        <div className="col-12">
            <SignatureSection user={user} setUser={setUser} token={token} />
        </div>
      </div>
    </div>

      <input 
        ref={certificate_input_ref}
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreviewUrl(reader.result);
              setCrop(null);
              setShowCertificateModal(true);
            };
            reader.readAsDataURL(file);
          }
        }}
        accept="image/*"
        className="d-none"
      />

    <CropModal
      showModal={showCropModal}
      imageUrl={previewUrl}
      onClose={() => {
        setShowCropModal(false);
        setPreviewUrl(null);
          setIsPanImage(false);
          setIsAccountImage(false);
          setIsAadharFront(false);
          setIsProfilePic(false);
      }}
      onSave={
          isProfilePic
            ? handleProfilePicCroppedImage
            : isPanImage 
              ? handlePanCroppedImage 
          : isAccountImage
            ? handleAccountCroppedImage
                : handleAadharCroppedImage
      }
      imageType={
          isProfilePic
            ? "profile picture"
            : isPanImage 
            ? "pan"
          : isAccountImage
            ? "account"
            : isAadharFront
            ? "aadhar front"
                  : "aadhar back"
        }
        aspectRatio={isProfilePic ? 1 : undefined}
    />

    <CropModal
      showModal={showCertificateModal}
      imageUrl={previewUrl}
      onClose={() => {
        setShowCertificateModal(false);
        setPreviewUrl(null);
      }}
      onSave={handleCertificateCroppedImage}
      imageType="certificate"
    />
    </div>
);
};

export default UserProfile;
