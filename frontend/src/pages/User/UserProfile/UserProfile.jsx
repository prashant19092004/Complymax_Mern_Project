import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import "../../../component1/UserDashboard/style.css";
import "../../../component1/Home/style.css";
import "./UserProfile.css";
import PanForm from "../../../component1/UserDashboard/PanForm";
import { useNavigate } from "react-router-dom";
import { FaRegEdit, FaIdCard, FaCalendar, FaUser, FaPhone, FaMapMarkerAlt, FaGlobe, FaEnvelope } from "react-icons/fa";
import close from "../../../assets/close.png";
import { toast } from "react-toastify";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import default_pic from "../../../assets/Default_pfp.svg.png";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { createPortal } from "react-dom";
import CropModal from "./CropModal";
import AadharSection from "./UserProfileComponent/AadharSection";
import EducationSection from './UserProfileComponent/EducationSection';
import ExperienceSection from './UserProfileComponent/ExperienceSection';
import PanSection from './UserProfileComponent/PanSection';
import AccountSection from './UserProfileComponent/AccountSection';

const UserProfile = () => {
    const token = localStorage.getItem("token");
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const enquiryref = useRef();
    const profile_pic_input_ref = useRef();
    const experienceElement = useRef();
  const [isExperience, setIsExperience] = useState(false);
    const [educationEdit, setEducationEdit] = useState(false);
    const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
    const pan_image_input_ref = useRef();
    const [panFile, setPanFile] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [crop, setCrop] = useState({
    unit: "px",
      x: 0,
      y: 0,
      width: 200,
    height: 150,
    });
    const [tempImage, setTempImage] = useState(null);
    const [completedCrop, setCompletedCrop] = useState(null);
    const imageRef = useRef(null);
    const [isPanImage, setIsPanImage] = useState(false);
    const previewCanvasRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);
    const ASPECT_RATIOS = [
    { label: "4:3", value: 4 / 3 },
    { label: "3:2", value: 3 / 2 },
    { label: "1:1", value: 1 },
    { label: "2:3", value: 2 / 3 },
    { label: "16:9", value: 16 / 9 },
    { label: "Free", value: null },
    ];

    const [educationData, setEducationData] = useState({
    institute: "",
    degree: "",
    starting_month: "",
    starting_year: "",
    ending_month: "",
    ending_year: "",
    score: "",
    description: "",
    editId: "",
    });

    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
  const blobUrlRef = useRef("");
    const hiddenAnchorRef = useRef(null);
    const aadhar_image_input_ref = useRef();

    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [currentEducationId, setCurrentEducationId] = useState(null);
    const certificate_input_ref = useRef();

    const account_image_input_ref = useRef();
    const [isAccountImage, setIsAccountImage] = useState(false);

    const aadhar_front_image_input_ref = useRef();
    const aadhar_back_image_input_ref = useRef();
    const [isAadharFront, setIsAadharFront] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
const years = [];
for (let year = 1951; year <= 2024; year++) {
  years.push(year);
}

let changeHandler = (e) => {
  setEducationData({
      ...educationData,
      [e.target.name]: e.target.value,
  });
  };

const onFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    setFile(selectedFile);
    onSubmit(selectedFile);
  }
};

const onPanImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setIsPanImage(true);
  
  // Create a URL for the image
  const imageUrl = URL.createObjectURL(file);
  setPanFile(file);
  setTempImage(imageUrl);
  setCrop({
      unit: "px",
    x: 0,
    y: 0,
    width: 200,
      height: 150,
  });
  setShowCropModal(true);

  // Clean up URL when component unmounts
  return () => URL.revokeObjectURL(imageUrl);
};

  async function fetchingProfile() {
    try {
    setLoading(true);
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/user/profile`, {
      headers: {
            Authorization: `Bearer ${token}`,
          },
    })
    .then((res) => {
      setUser(res.data);
      setLoading(false);
        });
    } catch (err) {
      toast.error("Try Again..");
  }
}

  // console.log(userHistory)
useEffect(() => {
  fetchingProfile();
}, []);

const onSubmit = async (selectedFile) => {
  const formData = new FormData();
    formData.append("profilePic", selectedFile);

  try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload/profile-pic`,
        formData,
        {
      headers: {
            "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
        }
      );
      toast.success("Profile picture uploaded successfully!");
    setUser({ ...user, profilePic: res.data.user.profilePic });
  } catch (err) {
      toast.error("Error uploading profile picture");
    console.log(err);
  }
};

const onSelectFile = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setCrop(null);
      setShowCropModal(true);
    };

    reader.readAsDataURL(file);
  }
};

const generatePreview = useCallback((completedCrop, imgRef) => {
  if (!completedCrop || !imgRef.current) return;

  const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

  if (!ctx) {
      throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = completedCrop.width;
  canvas.height = completedCrop.height;

  ctx.drawImage(
    image,
    completedCrop.x * scaleX,
    completedCrop.y * scaleY,
    completedCrop.width * scaleX,
    completedCrop.height * scaleY,
    0,
    0,
    completedCrop.width,
    completedCrop.height
  );

  return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
      resolve(blob);
        },
        "image/jpeg",
        1
      );
  });
}, []);

const handleCroppedImage = async (blob) => {
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

const handleAadharFrontCroppedImage = async (blob) => {
  try {
    const formData = new FormData();
      const file = new File([blob], "cropped-aadhar-front.jpeg", {
        type: "image/jpeg",
      });
      formData.append("image", file);

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/upload/aadhar-front-image`,
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
      `${process.env.REACT_APP_BACKEND_URL}/upload/aadhar-back-image`,
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

const handleDeleteAadharFrontImage = async () => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/delete/aadhar-front-image`,
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
          aadhar_front_image: null,
      }));
        toast.success("Aadhar front image deleted successfully!");
    }
  } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
  }
};

const handleDeleteAadharBackImage = async () => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/delete/aadhar-back-image`,
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
          aadhar_back_image: null,
      }));
        toast.success("Aadhar back image deleted successfully!");
    }
  } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
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
      `${process.env.REACT_APP_BACKEND_URL}/upload/account-image`,
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

const handleDeleteAccountImage = async () => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/delete/account-image`,
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
          account_image: null,
      }));
        toast.success("Account image deleted successfully!");
    }
  } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
  }
};

  if (loading) {
    return <div>Loading</div>;
}

function addPan() {
    navigate("/user_dashboard/add_pan");
}

function addUan() {
    navigate("/user_dashboard/add_uan_esic");
}

function addAccount() {
    navigate("/user_dashboard/add_account");
}

let openEnquiry = () => {
  setEducationEdit(false);
  setEducationData({
      institute: "",
      degree: "",
      starting_month: "",
      starting_year: "",
      ending_month: "",
      ending_year: "",
      score: "",
      description: "",
      editId: "",
    });
  const enquiry_pop_up = document.querySelector(".enquiry-section");
  enquiry_pop_up.style.scale = 1;
  };

let closeEnquiry = () => {
  setEducationEdit(false);
  setEducationData({
      institute: "",
      degree: "",
      starting_month: "",
      starting_year: "",
      ending_month: "",
      ending_year: "",
      score: "",
      description: "",
      editId: "",
    });
  const enquiry_pop_up = document.querySelector(".enquiry-section");
  enquiry_pop_up.style.scale = 0;
};

const handleProfilePicClick = () => {
  profile_pic_input_ref.current.click();
};

const handlePanImageClick = () => {
  pan_image_input_ref.current.click();
};

  let addEducation = async () => {
    try {
      const response = await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/user/${
            isExperience ? "add_experience" : "add_education"
          }`,
        educationData,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        }
    )
    .then((res) => {
          if (res.data.success) {
          toast.success(res.data.message);
          setUser(res.data.currentUser1);
          setEducationData({
              institute: "",
              degree: "",
              starting_month: "",
              starting_year: "",
              ending_month: "",
              ending_year: "",
              score: "",
              description: "",
              editId: "",
          });
          closeEnquiry();
          } else {
          toast.error(res.data.message);
        }
        });
    } catch (err) {
      toast.error("try again");
  }
  };

let editEducation = (uid) => {
  console.log(uid);
  // setEditId(uid);
  setEducationEdit(true);

  let filteredData;
  console.log(isExperience);
    if (isExperience) {
    filteredData = user.experiences.filter((experience) => {
        return experience._id == uid;
    });  

    setEducationData({
        institute: filteredData[0].company,
        degree: filteredData[0].role,
        starting_month: filteredData[0].starting_month,
        starting_year: filteredData[0].starting_year,
        ending_month: filteredData[0].ending_month,
        ending_year: filteredData[0].ending_year,
        score: filteredData[0].location,
        description: filteredData[0].description,
        editId: uid,
      });
    } else {
    filteredData = user.qualifications.filter((qualification) => {
        return qualification._id == uid;
    });

    setEducationData({
        institute: filteredData[0].institute,
        degree: filteredData[0].degree,
        starting_month: filteredData[0].starting_month,
        starting_year: filteredData[0].starting_year,
        ending_month: filteredData[0].ending_month,
        ending_year: filteredData[0].ending_year,
        score: filteredData[0].score,
        description: filteredData[0].description,
        editId: uid,
    });
  }

  enquiryref.current.style.scale = 1;
  };

  let deleteEducation = async () => {
  const uid = educationData.editId;
  const data = {
      uid,
    };
    try {
    console.log(uid);
      const response = await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/user/${
            isExperience ? "delete_experience" : "delete_education"
          }`,
      data,
      {
        headers: {
              Authorization: `Bearer ${token}`,
            },
      }
    )
    .then((res) => {
          if (res.data.success) {
        console.log(res);
        setUser(res.data.currentUser);
        closeEnquiry();
      }
        });
    } catch (err) {
    toast.error("try again");
  }
  };

const handleCertificateCroppedImage = async (blob) => {
  try {
    const formData = new FormData();
      formData.append("certificate", blob, "certificate-image.jpeg");
      formData.append("id", currentEducationId);
      formData.append("type", isExperience ? "experience" : "education");

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/upload/certificate`,
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
          `${
            isExperience ? "Experience" : "Education"
          } certificate uploaded successfully!`
        );
      setShowCertificateModal(false);
      setPreviewUrl(null);
    }
  } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload certificate");
  }
};

const handleDeleteCertificate = async (id) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/delete/certificate`,
      { 
        id,
          type: isExperience ? "experience" : "education",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.user) {
      setUser(response.data.user);
        toast.success(
          `${
            isExperience ? "Experience" : "Education"
          } certificate deleted successfully!`
        );
    }
  } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete certificate");
  }
};

  return (
  <>
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
                src={
                  user.profilePic
                    ? `${process.env.REACT_APP_BACKEND_URL}${user.profilePic}`
                    : default_pic
                }
                alt="Avatar"
                      className="rounded-circle profile-pic"
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover',
                        border: '3px solid #fff',
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                      }}
              />
              <div
                onClick={handleProfilePicClick}
                      className="position-absolute end-0 bottom-0 rounded-circle p-1 p-sm-2 bg-light shadow-sm edit-profile-btn"
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div className="bg-primary rounded-circle p-1 p-sm-2">
                        <MdEdit className="text-light" size={16} />
            </div>
          </div>
        </div>
      </div>
                <div className="profile-info">
                  <h2 className="mb-1 mb-sm-2 fw-bold text-primary" style={{ fontSize: '1.5rem' }}>{user.full_Name}</h2>
                  <p className="text-muted mb-2 d-flex align-items-center justify-content-center justify-content-md-start">
                    <FaEnvelope className="me-2" size={14} />
                    <span style={{ fontSize: '0.9rem' }}>{user.email}</span>
                  </p>
                  <div className="d-flex justify-content-center justify-content-md-start align-items-center flex-wrap gap-1 gap-sm-2">
                    <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                      <FaUser className="me-1" size={12} />
                      {user.gender === "M" ? "Male" : "Female"}
                    </span>
                    <span className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                      <FaPhone className="me-1" size={12} />
                      {user.contact}
                    </span>
            </div>
            </div>
            </div>
            </div>
            </div>
              </div>
          </div>

      {/* Personal Information Section */}
      <div className="row mb-3 mb-md-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
                <h4 className="card-title mb-0 fw-bold text-primary">
                  <FaUser className="me-2" />
                  Personal Information
                </h4>
              </div>
              <div className="row g-3 g-md-4">
                <div className="col-12 col-sm-6 col-md-4">
                  <div className="info-card p-3 rounded-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-container bg-primary-subtle rounded-circle p-2 p-md-3 me-3">
                        <FaIdCard className="text-primary" size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block">Aadhar No.</small>
                        <span className="fw-medium">{user.aadhar_number}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <div className="info-card p-3 rounded-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-container bg-primary-subtle rounded-circle p-2 p-md-3 me-3">
                        <FaCalendar className="text-primary" size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block">Date Of Birth</small>
                        <span className="fw-medium">{user.dob}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <div className="info-card p-3 rounded-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-container bg-primary-subtle rounded-circle p-2 p-md-3 me-3">
                        <FaMapMarkerAlt className="text-primary" size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block">State</small>
                        <span className="fw-medium">{user.state}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <div className="info-card p-3 rounded-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-container bg-primary-subtle rounded-circle p-2 p-md-3 me-3">
                        <FaGlobe className="text-primary" size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block">Country</small>
                        <span className="fw-medium">{user.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
              </div>

      {/* Document Sections */}
      <div className="row g-3 g-md-4">
        <div className="col-12">
        <AadharSection
          user={user}
          setUser={setUser}
          setShowCropModal={setShowCropModal}
          setPreviewUrl={setPreviewUrl}
          setIsPanImage={setIsPanImage}
          setCrop={setCrop}
          token={token}
          isAadharFront={isAadharFront}
          setIsAadharFront={setIsAadharFront}
          handleAadharFrontCroppedImage={handleAadharFrontCroppedImage}
          handleAadharBackCroppedImage={handleAadharBackCroppedImage}
          handleDeleteAadharFrontImage={handleDeleteAadharFrontImage}
          handleDeleteAadharBackImage={handleDeleteAadharBackImage}
        />
        </div>

        <div className="col-12">
        <PanSection 
          user={user}
          addPan={addPan}
          pan_image_input_ref={pan_image_input_ref}
          handleDeletePanImage={handleDeletePanImage}
          setPreviewUrl={setPreviewUrl}
          setCrop={setCrop}
          setShowCropModal={setShowCropModal}
          setIsPanImage={setIsPanImage}
        />
        </div>

        <div className="col-12">
        <AccountSection 
          user={user}
          addAccount={addAccount}
          account_image_input_ref={account_image_input_ref}
          handleDeleteAccountImage={handleDeleteAccountImage}
          setPreviewUrl={setPreviewUrl}
          setCrop={setCrop}
          setShowCropModal={setShowCropModal}
          setIsAccountImage={setIsAccountImage}
        />
        </div>

        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 mb-md-4">
                <h4 className="card-title mb-2 mb-md-0 fw-bold text-primary">
                  <FaIdCard className="me-2" />
                  UAN/ESIC Details
                </h4>
                <button 
                  onClick={addUan}
                  className="btn btn-primary btn-sm"
                >
              {user.uan_number ? "Change" : "Add"}
            </button>
            </div>
              <div className="row g-3 g-md-4">
                <div className="col-12 col-md-6">
                  <div className="info-card p-3 rounded-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-container bg-primary-subtle rounded-circle p-2 p-md-3 me-3">
                        <FaIdCard className="text-primary" size={20} />
              </div>
                      <div>
                        <small className="text-muted d-block">UAN Number</small>
                        <span className="fw-medium">{user.uan_number || 'Not added'}</span>
              </div>
            </div>
        </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="info-card p-3 rounded-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-container bg-primary-subtle rounded-circle p-2 p-md-3 me-3">
                        <FaIdCard className="text-primary" size={20} />
                      </div>
                      <div>
                        <small className="text-muted d-block">ESIC Number</small>
                        <span className="fw-medium">{user.esic_number || 'Not added'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
        <EducationSection 
          user={user}
          setIsExperience={setIsExperience}
          openEnquiry={openEnquiry}
          editEducation={editEducation}
          handleDeleteCertificate={handleDeleteCertificate}
          setCurrentEducationId={setCurrentEducationId}
          certificate_input_ref={certificate_input_ref}
        />
        </div>

        <div className="col-12">
        <ExperienceSection 
          user={user}
          setIsExperience={setIsExperience}
          openEnquiry={openEnquiry}
          editEducation={editEducation}
          handleDeleteCertificate={handleDeleteCertificate}
          setCurrentEducationId={setCurrentEducationId}
          certificate_input_ref={certificate_input_ref}
        />
        </div>
      </div>
    </div>

    {/* Add CSS styles */}
    <style>
      {`
        .profile-pic-container {
          position: relative;
          transition: transform 0.3s ease;
        }
        
        .profile-pic-container:hover {
          transform: scale(1.02);
        }
        
        .edit-profile-btn:hover {
          transform: scale(1.1);
        }
        
        .info-card {
          background-color: #f8f9fa;
          transition: all 0.3s ease;
        }
        
        .info-card:hover {
          background-color: #fff;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }
        
        .icon-container {
          transition: all 0.3s ease;
        }
        
        .icon-container:hover {
          transform: scale(1.1);
        }
        
        .badge {
          padding: 0.5rem 0.75rem;
          font-weight: 500;
        }
        
        .profile-info {
          flex: 1;
        }

        @media (max-width: 768px) {
          .profile-pic {
            width: 100px !important;
            height: 100px !important;
          }
          
          .card-body {
            padding: 1rem;
          }
          
          .info-card {
            margin-bottom: 0.5rem;
          }
        }
      `}
    </style>

    <section ref={enquiryref} className="enquiry-section">
      <div className="enquiry-form">
          <img
            onClick={closeEnquiry}
            className="enquiry-close"
            src={close}
            alt=""
          />
          <h2>Add {isExperience ? "Experience" : "Education"}</h2>
          <form
            action="#"
            onSubmit={(e) => {
              e.preventDefault();
              addEducation();
            }}
          >
          <div className="input-box">
            <div className="input-div">
                <label className="form-label" for="institute">
                  {isExperience ? "Company" : "School/College"}
                </label>
                <input
                  required
                  type="text"
                  value={educationData.institute}
                  name="institute"
                  onChange={changeHandler}
                  id="institute"
                  placeholder={isExperience ? "Company" : "Institute"}
                  autoComplete="off"
                />
            </div>
          </div>
          <div className="input-box">
            <div className="input-div">
                <label className="form-label" for="contact_no">
                  {isExperience ? "Role" : "Degree"}
                </label>
                <input
                  required
                  type="text"
                  value={educationData.degree}
                  name="degree"
                  onChange={changeHandler}
                  id="degree"
                  placeholder={isExperience ? "eg: Supervisor" : "eg: B.E"}
                  autoComplete="off"
                />
            </div>  
          </div>
          <div className="input-box">
            <div className="input-div">
                <label className="form-label" for="starting_from">
                  Starting From
                </label>
                <select
                  placeholder="Month"
                  value={educationData.starting_month}
                  name="starting_month"
                  id="starting_month"
                  className=""
                  onChange={changeHandler}
                >
                  <option value="" placeholder="Month">
                    Month
                  </option>
                  {months.map((month) => {
                    return (
                      <option value={month} key={month}>
                        {month}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="input-div">
              <label className="form-label" for="starting_year"></label>
                <select
                  placeholder="Year"
                  value={educationData.starting_year}
                  name="starting_year"
                  id="starting_year"
                  className=""
                  onChange={changeHandler}
                >
                  <option value="" placeholder="Year">
                    Year
                  </option>
                  {years.map((year) => {
                    return (
                      <option value={year} key={year}>
                        {year}
                      </option>
                    );
                  })}
              </select>
            </div>  
          </div>
          <div className="input-box">
            <div className="input-div">
                <label className="form-label" for="ending_in">
                  Ending In
                </label>
                <select
                  placeholder="Month"
                  value={educationData.ending_month}
                  name="ending_month"
                  id="ending_month"
                  className=""
                  onChange={changeHandler}
                >
                  <option value="" placeholder="Month">
                    Month
                  </option>
                  {months.map((month) => {
                    return (
                      <option value={month} key={month}>
                        {month}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="input-div">
              <label className="form-label" for="ending_year"></label>
                <select
                  placeholder="Year"
                  name="ending_year"
                  value={educationData.ending_year}
                  id="ending_year"
                  className=""
                  onChange={changeHandler}
                >
                  <option value="" placeholder="Year">
                    Year
                  </option>
                  {years.map((year) => {
                    return (
                      <option value={year} key={year}>
                        {year}
                      </option>
                    );
                  })}
              </select>
            </div>  
          </div>
          <div className="input-box">
            <div className="input-div">
                <label className="form-label" for="Score">
                  {isExperience ? "Location" : "Score"}
                </label>
                <input
                  required
                  type="text"
                  value={educationData.score}
                  name="score"
                  onChange={changeHandler}
                  id="score"
                  placeholder={isExperience ? "Location" : "Score"}
                  autoComplete="off"
                />
            </div>  
          </div>
          <div className="input-div">
              <label className="form-label" for="email">
                Description
              </label>
              <textarea
                value={educationData.description}
                type="text"
                name="description"
                onChange={changeHandler}
                id="description"
                placeholder="Description"
                autoComplete="off"
              ></textarea>
          </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <h2
                onClick={() => deleteEducation()}
                className="fs-6 cursor-pointer"
              >
                {educationEdit ? "Delete this entry" : ""}
              </h2>
              <button className="enquiry-button" type="submit">
                Save
              </button>
          </div>
        </form>
      </div>
    </section>

    <CropModal
      showModal={showCropModal}
      imageUrl={previewUrl}
      onClose={() => {
        setShowCropModal(false);
        setPreviewUrl(null);
      }}
      onSave={
        isPanImage 
          ? handleCroppedImage 
          : isAccountImage
            ? handleAccountCroppedImage
            : isAadharFront
              ? handleAadharFrontCroppedImage
              : handleAadharBackCroppedImage
      }
      imageType={
        isPanImage 
            ? "pan"
          : isAccountImage
            ? "account"
            : isAadharFront
            ? "aadhar front"
            : "aadhar back"
      }
    />

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
      showModal={showCertificateModal}
      imageUrl={previewUrl}
      onClose={() => {
        setShowCertificateModal(false);
        setPreviewUrl(null);
      }}
      onSave={handleCertificateCroppedImage}
      imageType="certificate"
    />
  </>
);
};

export default UserProfile;
