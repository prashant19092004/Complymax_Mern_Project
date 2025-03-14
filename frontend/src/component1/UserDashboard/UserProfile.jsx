import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import './style.css';
import './../Home/style.css';
import './UserProfile.css';
import PanForm from './PanForm';
import { useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import close from './../../assets/close.png';
import { toast } from 'react-toastify';
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import default_pic from '../../assets/Default_pfp.svg.png'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { createPortal } from 'react-dom';
import CropModal from './CropModal';

const UserProfile = () => {

    const token = localStorage.getItem("token");
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const enquiryref = useRef();
    const profile_pic_input_ref = useRef();
    const experienceElement = useRef();
    const [ isExperience, setIsExperience ] = useState(false);
    const [educationEdit, setEducationEdit] = useState(false);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const pan_image_input_ref = useRef();
    const [panFile, setPanFile] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [crop, setCrop] = useState({
      unit: 'px',
      x: 0,
      y: 0,
      width: 200,
      height: 150
    });
    const [tempImage, setTempImage] = useState(null);
    const [completedCrop, setCompletedCrop] = useState(null);
    const imageRef = useRef(null);
    const [isPanImage, setIsPanImage] = useState(false);
    const previewCanvasRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(4/3);
    const ASPECT_RATIOS = [
      { label: '4:3', value: 4/3 },
      { label: '3:2', value: 3/2 },
      { label: '1:1', value: 1 },
      { label: '2:3', value: 2/3 },
      { label: '16:9', value: 16/9 },
      { label: 'Free', value: null }
    ];

    const [educationData, setEducationData] = useState({
      institute: '',
      degree: '',
      starting_month: '',
      starting_year : '',
      ending_month:'',
      ending_year : '',
      score : '',
      description: '',
      editId : ''
    });

    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const blobUrlRef = useRef('');
    const hiddenAnchorRef = useRef(null);
    const aadhar_image_input_ref = useRef();

    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [currentEducationId, setCurrentEducationId] = useState(null);
    const certificate_input_ref = useRef();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = [];
for (let year = 1951; year <= 2024; year++) {
  years.push(year);
}

let changeHandler = (e) => {
  setEducationData({
    ...educationData, [e.target.name] : e.target.value
  });
}

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
    unit: 'px',
    x: 0,
    y: 0,
    width: 200,
    height: 150
  });
  setShowCropModal(true);

  // Clean up URL when component unmounts
  return () => URL.revokeObjectURL(imageUrl);
};

async function fetchingProfile(){
  try{
    setLoading(true);
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/profile`, {
      headers: {
        Authorization : `Bearer ${token}`
      }
    })
    .then((res) => {
      setUser(res.data);
      setLoading(false);
    })
  }catch(err){
    toast.error('Try Again..')
  }
}

  // console.log(userHistory)
useEffect(() => {
  fetchingProfile();
}, []);

const onSubmit = async (selectedFile) => {
  const formData = new FormData();
  formData.append('profilePic', selectedFile);

  try {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload/profile-pic`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Profile picture uploaded successfully!');
    setUser({ ...user, profilePic: res.data.user.profilePic });
  } catch (err) {
    toast.error('Error uploading profile picture');
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
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
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
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 1);
  });
}, []);

const handleCroppedImage = async (blob) => {
  try {
    const formData = new FormData();
    formData.append('panImage', blob, 'cropped-pan-image.jpeg');

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/upload/pan-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.user) {
      setUser(prev => ({
        ...prev,
        pan_image: response.data.user.pan_image
      }));
      toast.success('Pan card image uploaded successfully!');
      setShowCropModal(false);
      setPreviewUrl(null);
    }
  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Failed to upload image');
  }
};

const handleAadharCroppedImage = async (blob) => {
  try {
    const formData = new FormData();
    formData.append('aadharImage', blob, 'cropped-aadhar-image.jpeg');

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/upload/aadhar-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.user) {
      setUser(prev => ({
        ...prev,
        aadhar_image: response.data.user.aadhar_image
      }));
      toast.success('Aadhar card image uploaded successfully!');
      setShowCropModal(false);
      setPreviewUrl(null);
    }
  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Failed to upload image');
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
      setUser(prev => ({
        ...prev,
        pan_image: null
      }));
      toast.success('Pan card image deleted successfully!');
    }
  } catch (error) {
    console.error('Delete error:', error);
    toast.error('Failed to delete image');
  }
};

const handleDeleteAadharImage = async () => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/delete/aadhar-image`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.user) {
      setUser(prev => ({
        ...prev,
        aadhar_image: null
      }));
      toast.success('Aadhar card image deleted successfully!');
    }
  } catch (error) {
    console.error('Delete error:', error);
    toast.error('Failed to delete image');
  }
};

if(loading) {
  return(<div>Loading</div>)
}

function addPan() {
  navigate('/user_dashboard/add_pan');
}

function addUan() {
  navigate('/user_dashboard/add_uan_esic');
}

function addAccount() {
  navigate('/user_dashboard/add_account');
}

let openEnquiry = () => {
  setEducationEdit(false);
  setEducationData({
      institute: '',
      degree: '',
      starting_month: '',
      starting_year : '',
      ending_month:'',
      ending_year : '',
      score : '',
      description: '',
      editId : ''
  })
  const enquiry_pop_up = document.querySelector(".enquiry-section");
  enquiry_pop_up.style.scale = 1;
}

let closeEnquiry = () => {
  setEducationEdit(false);
  setEducationData({
      institute: '',
      degree: '',
      starting_month: '',
      starting_year : '',
      ending_month:'',
      ending_year : '',
      score : '',
      description: '',
      editId : ''
  })
  const enquiry_pop_up = document.querySelector(".enquiry-section");
  enquiry_pop_up.style.scale = 0;
};

const handleProfilePicClick = () => {
  profile_pic_input_ref.current.click();
};

const handlePanImageClick = () => {
  pan_image_input_ref.current.click();
};

let addEducation = async() => {
  try{
    const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/${isExperience ? 'add_experience' : 'add_education'}`,
        educationData,
        {
            headers: {
              Authorization : `Bearer ${token}`
            }
        }
    )
    .then((res) => {
        if(res.data.success){
          toast.success(res.data.message);
          setUser(res.data.currentUser1);
          setEducationData({
              institute: '',
              degree: '',
              starting_month: '',
              starting_year : '',
              ending_month:'',
              ending_year : '',
              score : '',
              description: '',
              editId : ''
          });
          closeEnquiry();
        }
        else{
          toast.error(res.data.message);
        }
    })
  }catch(err){
      toast.error("try again");
  }
}

let editEducation = (uid) => {
  console.log(uid);
  // setEditId(uid);
  setEducationEdit(true);


  let filteredData;
  console.log(isExperience);
  if(isExperience){
    filteredData = user.experiences.filter((experience) => {
      return (experience._id == uid);
    });  

    setEducationData({
      institute : filteredData[0].company,
      degree : filteredData[0].role,
      starting_month : filteredData[0].starting_month,
      starting_year : filteredData[0].starting_year,
      ending_month : filteredData[0].ending_month,
      ending_year : filteredData[0].ending_year,
      score : filteredData[0].location,
      description : filteredData[0].description,
      editId : uid
    });
  }
  else{
    filteredData = user.qualifications.filter((qualification) => {
      return (qualification._id == uid);
    });

    setEducationData({
      institute : filteredData[0].institute,
      degree : filteredData[0].degree,
      starting_month : filteredData[0].starting_month,
      starting_year : filteredData[0].starting_year,
      ending_month : filteredData[0].ending_month,
      ending_year : filteredData[0].ending_year,
      score : filteredData[0].score,
      description : filteredData[0].description,
      editId : uid
    });
  }

  enquiryref.current.style.scale = 1;

}

let deleteEducation = async() => {

  const uid = educationData.editId;
  const data = {
    uid
  }
  try{
    console.log(uid);
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/user/${isExperience ? 'delete_experience' : 'delete_education'}`,
      data,
      {
        headers: {
          Authorization : `Bearer ${token}`
        }
      }
    )
    .then((res) => {
      if(res.data.success){
        console.log(res);
        setUser(res.data.currentUser);
        closeEnquiry();
      }
    })
  }catch(err){
    toast.error("try again");
  }
}

const handleCertificateCroppedImage = async (blob) => {
  try {
    const formData = new FormData();
    formData.append('certificate', blob, 'certificate-image.jpeg');
    formData.append('id', currentEducationId);
    formData.append('type', isExperience ? 'experience' : 'education');

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/upload/certificate`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.user) {
      setUser(response.data.user);
      toast.success(`${isExperience ? 'Experience' : 'Education'} certificate uploaded successfully!`);
      setShowCertificateModal(false);
      setPreviewUrl(null);
    }
  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Failed to upload certificate');
  }
};

const handleDeleteCertificate = async (id) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/delete/certificate`,
      { 
        id,
        type: isExperience ? 'experience' : 'education'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.user) {
      setUser(response.data.user);
      toast.success(`${isExperience ? 'Experience' : 'Education'} certificate deleted successfully!`);
    }
  } catch (error) {
    console.error('Delete error:', error);
    toast.error('Failed to delete certificate');
  }
};

  return (
    <>
      <div id="screen">
        <form onSubmit={onSubmit} className='d-none'>
          <input ref={profile_pic_input_ref} type="file" onChange={onFileChange} />
        </form>
        <div id="content">
          <div className='position-relative'>
            <img id="user-avatar" src={user.profilePic ? `${process.env.REACT_APP_BACKEND_URL}${user.profilePic}` : default_pic} alt="Avatar" />
            <div onClick={handleProfilePicClick} className='position-absolute end-4 bottom-4 rounded-circle p-1 bg-light' style={{height : '30px', width : '30px'}}>
              <div className='bg-primary h-full w-full rounded-circle d-flex justify-content-center align-items-center'>
                <MdEdit className='text-light'  />
              </div>
            </div>
          </div>
          <p id="user-name">{user.full_Name}</p>
          <p id="user-location">{user.email}</p>
        </div>
        <div className="container1 px-5">
          <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
              <div className="flex flex-col profile-content-box">
                <dt>Aadhar No.</dt>
                <dd>{user.aadhar_number}</dd>
              </div>
              <div className="flex flex-col profile-content-box">
                <dt>Date Of Birth</dt>
                <dd>{user.dob}</dd>
              </div>
              <div className="flex flex-col profile-content-box">
                <dt>Gender</dt>
                <dd>{user.gender === 'M' ? 'Male' : 'Female'}</dd>
              </div>
              <div className="flex flex-col profile-content-box">
                <dt>Phone Number</dt>
                <dd>{user.contact}</dd>
              </div>
              <div className="flex flex-col profile-content-box">
                <dt>State</dt>
                <dd>{user.state}</dd>
              </div>
              <div className="flex flex-col profile-content-box">
                <dt>Country</dt>
                <dd>{user.country}</dd>
              </div>
          </div>
        </div>
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
                  <dt>Aadhar Card Image</dt>
                  <dd className="d-flex align-items-center gap-2">
                    {user.aadhar_image ? (
                      <>
                        <span className="text-success">
                          <i className="fas fa-check-circle"></i> Uploaded
                        </span>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => window.open(`${process.env.REACT_APP_BACKEND_URL}${user.aadhar_image}`, '_blank')}
                          >
                            View Image
                          </button>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => aadhar_image_input_ref.current.click()}
                          >
                            Update
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleDeleteAadharImage}
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
                          onClick={() => aadhar_image_input_ref.current.click()}
                          className="btn btn-primary btn-sm"
                        >
                          Upload Now
                        </button>
                      </>
                    )}
                    <input 
                      ref={aadhar_image_input_ref}
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          
                          reader.onloadend = () => {
                            setPreviewUrl(reader.result);
                            setCrop(null);
                            setShowCropModal(true);
                            setIsPanImage(false); // Set this to false for Aadhar
                          };

                          reader.readAsDataURL(file);
                        }
                      }}
                      accept="image/*"
                      className="d-none"
                    />
                  </dd>
                </div>
              </div>
          </div>
          <div className='id_sec'>
              <div className='pan_heading'>
                  <h1>Pan Card</h1>
                  <button onClick={addPan} >{user.pan_added ? 'Change' : 'Add'}</button>
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
                      onChange={onSelectFile}
                      accept="image/*"
                      className="d-none"
                    />
                  </dd>
                </div>
              </div>
          </div>
          <div className='id_sec'>
              <div className='pan_heading'>
                  <h1>Existing UAN/ESIC Number</h1>
                  <button onClick={addUan} >{user.uan_number ? 'Change' : 'Add'}</button>
              </div>
              <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
                <div className="flex flex-col profile-content-box">
                  <dt>UAN Number</dt>
                  <dd>{user.uan_number}</dd>
                </div>
                <div className="flex flex-col profile-content-box">
                  <dt>ESIC Number</dt>
                  <dd>{user.esic_number}</dd>
                </div>
              </div>
          </div>
          <div className='id_sec'>
              <div className='pan_heading'>
                  <h1>Account</h1>
                  <button onClick={addAccount} >{user.account_added ? 'Change' : 'Add'}</button>
              </div>
              <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
                <div className="flex flex-col profile-content-box">
                  <dt>Account No.</dt>
                  <dd>{user.account_number}</dd>
                </div>
                <div className="flex flex-col profile-content-box">
                  <dt>Name</dt>
                  <dd>{user.account_name}</dd>
                </div>
                <div className="flex flex-col profile-content-box">
                  <dt>IFSC code</dt>
                  <dd>{user.account_ifsc}</dd>
                </div>
              </div>
          </div>
          <div className='id_sec'>
              <div className='pan_heading'>
                  <h1>Education</h1>
                  <button onClick={() => {setIsExperience(false); openEnquiry();}} >Add Education</button>
              </div>
              <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-3 px-sm-5">
                {
                  user.qualifications?.map((qualification) => {
                    return(
                      <div className='w-full d-flex gap-3 justify-content-between align-items-center'>
                        <div>
                          <h1 className='fs-6'>{qualification.institute}</h1>
                          <p>{`${qualification.degree}  • ${qualification.starting_month} ${qualification.starting_year} - ${qualification.ending_month} ${qualification.ending_year}  • Score: ${qualification.score}`}</p>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          {qualification.certificate && (
                            <>
                              <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => window.open(`${process.env.REACT_APP_BACKEND_URL}${qualification.certificate}`, '_blank')}
                              >
                                <i className="fas fa-file-pdf"></i>
                              </button>
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteCertificate(qualification._id)}
                              >
                                <MdDeleteOutline size={18} />
                              </button>
                            </>
                          )}
                          <label 
                            className="btn btn-outline-success btn-sm mb-0" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setCurrentEducationId(qualification._id);
                              certificate_input_ref.current.click();
                            }}
                          >
                            <i className="fas fa-upload"></i>
                          </label>
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              setIsExperience(false); 
                              editEducation(qualification._id);
                            }}
                          >
                            <MdEdit size={18} />
                          </button>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
          </div>
          <div className='id_sec'>
              <div className='pan_heading'>
                  <h1>Experience</h1>
                  <button onClick={() => {setIsExperience(true); openEnquiry();}}>Add Experience</button>
              </div>
              <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-3 px-sm-5">
                {
                  user.experiences?.map((experience) => {
                    return(
                      <div className='w-full d-flex gap-3 justify-content-between align-items-center'>
                        <div>
                          <h1 className='fs-6'>{experience.company}</h1>
                          <p>{`${experience.role}  • ${experience.starting_month} ${experience.starting_year} - ${experience.ending_month} ${experience.ending_year}  • Location: ${experience.location}`}</p>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          {experience.certificate && (
                            <>
                              <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => window.open(`${process.env.REACT_APP_BACKEND_URL}${experience.certificate}`, '_blank')}
                              >
                                <i className="fas fa-file-pdf"></i>
                              </button>
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteCertificate(experience._id)}
                              >
                                <MdDeleteOutline size={18} />
                              </button>
                            </>
                          )}
                          <label 
                            className="btn btn-outline-success btn-sm mb-0" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setCurrentEducationId(experience._id);
                              setIsExperience(true);
                              certificate_input_ref.current.click();
                            }}
                          >
                            <i className="fas fa-upload"></i>
                          </label>
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              setIsExperience(true); 
                              editEducation(experience._id);
                            }}
                          >
                            <MdEdit size={18} />
                          </button>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
          </div>
      </div>
      <section ref={enquiryref} className="enquiry-section" >
        <div className="enquiry-form">
          <img onClick={closeEnquiry} className="enquiry-close" src={close} alt="" />
          <h2>Add {isExperience ? 'Experience' : 'Education'}</h2>
          <form action="#" onSubmit={(e) => { e.preventDefault(); addEducation(); }}>
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" for="institute">{isExperience ? 'Company' : 'School/College'}</label>
                <input required type="text" value={educationData.institute} name="institute" onChange={changeHandler} id="institute" placeholder={isExperience ? 'Company' : 'Institute'} autoComplete="off"/>
              </div>
            </div>
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" for="contact_no">{isExperience ? 'Role' : 'Degree'}</label>
                <input required type="text" value={educationData.degree} name="degree" onChange={changeHandler} id="degree" placeholder={isExperience ? 'eg: Supervisor' : 'eg: B.E'} autoComplete="off"/>
              </div>  
            </div>
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" for="starting_from">Starting From</label>
                <select placeholder="Month" value={educationData.starting_month} name='starting_month' id='starting_month' className='' onChange={changeHandler}>
                  <option value="" placeholder="Month">Month</option>
                  {
                    months.map((month) => {
                      return <option value={month} key={month}>{month}</option>
                    })
                  }
                </select>
              </div>
              <div className="input-div">
                <label className="form-label" for="starting_year"></label>
                <select placeholder="Year" value={educationData.starting_year} name='starting_year' id='starting_year' className='' onChange={changeHandler}>
                  <option value="" placeholder="Year">Year</option>
                  {
                    years.map((year) => {
                      return <option value={year} key={year}>{year}</option>
                    })
                  }
                </select>
              </div>  
            </div>
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" for="ending_in">Ending In</label>
                <select placeholder="Month" value={educationData.ending_month} name='ending_month' id='ending_month' className='' onChange={changeHandler}>
                  <option value="" placeholder="Month">Month</option>
                  {
                    months.map((month) => {
                      return <option value={month} key={month}>{month}</option>
                    })
                  }
                </select>
              </div>
              <div className="input-div">
                <label className="form-label" for="ending_year"></label>
                <select placeholder="Year" name='ending_year' value={educationData.ending_year} id='ending_year' className='' onChange={changeHandler}>
                  <option value="" placeholder="Year">Year</option>
                  {
                    years.map((year) => {
                      return <option value={year} key={year}>{year}</option>
                    })
                  }
                </select>
              </div>  
            </div>
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" for="Score">{isExperience ? 'Location' : 'Score'}</label>
                <input required type="text" value={educationData.score} name="score" onChange={changeHandler} id="score" placeholder={isExperience ? 'Location' : 'Score'} autoComplete="off"/>
              </div>  
            </div>
            <div className="input-div">
              <label className="form-label" for="email">Description</label>
              <textarea value={educationData.description} type="text" name="description" onChange={changeHandler} id="description" placeholder="Description" autoComplete="off"></textarea>
            </div>
            <div className='d-flex justify-content-between align-items-center mt-2'>
              <h2 onClick={() => deleteEducation()} className='fs-6 cursor-pointer'>{educationEdit ? 'Delete this entry' : ''}</h2>
              <button className="enquiry-button" type="submit" >Save</button>    
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
        onSave={isPanImage ? handleCroppedImage : handleAadharCroppedImage}
        imageType={isPanImage ? 'pan' : 'aadhar'}
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
