import React, { useRef, useState } from 'react';
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import CropModal from '../CropModal';

const EducationSection = ({ 
  user, 
  setUser,
  token
}) => {
  const [isExperience, setIsExperience] = useState(false);
  const [educationEdit, setEducationEdit] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [currentEducationId, setCurrentEducationId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const certificate_input_ref = useRef();
  const enquiryref = useRef();

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

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 2024 - 1951 + 1 }, (_, i) => 1951 + i);

  const changeHandler = (e) => {
    setEducationData({
      ...educationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCertificateCroppedImage = async (blob) => {
    try {
      const formData = new FormData();
      const file = new File([blob], "certificate-image.jpeg", {
        type: "image/jpeg",
      });
      formData.append("certificate", file);
      formData.append("id", currentEducationId);
      formData.append("type", "education");

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
        toast.success("Education certificate uploaded successfully!");
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
          type: "education"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.user) {
        setUser(response.data.user);
        toast.success("Education certificate deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete certificate");
    }
  };

  const addEducation = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/add_education`,
        educationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setUser(response.data.currentUser1);
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
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("try again");
    }
  };

  const editEducation = (uid) => {
    setEducationEdit(true);
    const filteredData = user.qualifications.filter((qualification) => {
      return qualification._id === uid;
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

    enquiryref.current.style.scale = 1;
  };

  const deleteEducation = async () => {
    const uid = educationData.editId;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/delete_education`,
        { uid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.currentUser);
        closeEnquiry();
      }
    } catch (err) {
      toast.error("try again");
    }
  };

  const openEnquiry = () => {
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
    enquiryref.current.style.scale = 1;
  };

  const closeEnquiry = () => {
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
    enquiryref.current.style.scale = 0;
  };

  return (
    <>
      <div className='id_sec'>
        <div className='pan_heading'>
          <h1>Education</h1>
          <button onClick={() => {setIsExperience(false); openEnquiry();}} >Add Education</button>
        </div>
        <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-3 px-sm-5">
          {
            user.qualifications?.map((qualification) => {
              return(
                <div key={qualification._id} className='w-full d-flex gap-3 justify-content-between align-items-center'>
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

      <section ref={enquiryref} className="enquiry-section">
        <div className="enquiry-form">
          <img
            onClick={closeEnquiry}
            className="enquiry-close"
            src={require("../../../../assets/close.png")}
            alt=""
          />
          <h2>Add Education</h2>
          <form
            action="#"
            onSubmit={(e) => {
              e.preventDefault();
              addEducation();
            }}
          >
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" htmlFor="institute">
                  School/College
                </label>
                <input
                  required
                  type="text"
                  value={educationData.institute}
                  name="institute"
                  onChange={changeHandler}
                  id="institute"
                  placeholder="Institute"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" htmlFor="degree">
                  Degree
                </label>
                <input
                  required
                  type="text"
                  value={educationData.degree}
                  name="degree"
                  onChange={changeHandler}
                  id="degree"
                  placeholder="eg: B.E"
                  autoComplete="off"
                />
              </div>  
            </div>
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" htmlFor="starting_month">
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
                  {months.map((month) => (
                    <option value={month} key={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-div">
                <label className="form-label" htmlFor="starting_year"></label>
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
                  {years.map((year) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>  
            </div>
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" htmlFor="ending_month">
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
                  {months.map((month) => (
                    <option value={month} key={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-div">
                <label className="form-label" htmlFor="ending_year"></label>
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
                  {years.map((year) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>  
            </div>
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" htmlFor="score">
                  Score
                </label>
                <input
                  required
                  type="text"
                  value={educationData.score}
                  name="score"
                  onChange={changeHandler}
                  id="score"
                  placeholder="Score"
                  autoComplete="off"
                />
              </div>  
            </div>
            <div className="input-div">
              <label className="form-label" htmlFor="description">
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
                onClick={deleteEducation}
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

      <input 
        ref={certificate_input_ref}
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreviewUrl(reader.result);
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

export default EducationSection;