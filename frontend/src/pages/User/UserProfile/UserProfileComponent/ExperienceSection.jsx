import React, { useRef, useState } from 'react';
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import CropModal from '../CropModal';

const ExperienceSection = ({ 
  user, 
  setUser,
  token
}) => {
  const [isExperience, setIsExperience] = useState(true);
  const [experienceEdit, setExperienceEdit] = useState(false);
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
      formData.append("type", "experience");

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
        toast.success("Experience certificate uploaded successfully!");
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
          type: "experience"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.user) {
        setUser(response.data.user);
        toast.success("Experience certificate deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete certificate");
    }
  };

  const addExperience = async (e) => {
    e.preventDefault();
    try {
      // Create the experience data object with correct field mappings
      const experienceData = {
        company: educationData.institute?.trim(),
        role: educationData.degree?.trim(),
        starting_month: educationData.starting_month?.trim(),
        starting_year: educationData.starting_year?.toString(),
        ending_month: educationData.ending_month?.trim() || "",
        ending_year: educationData.ending_year?.toString() || "",
        location: educationData.score?.trim(),
        description: educationData.description?.trim() || "",
        editId: educationData.editId || ""
      };

      // Check if required fields are filled
      if (!experienceData.company || !experienceData.role || 
          !experienceData.starting_month || !experienceData.starting_year || 
          !experienceData.location) {
        toast.error("Please fill all required fields");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/add_experience`,
        experienceData,
        {
          headers: {
            "Content-Type": "application/json",
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
        toast.error(response.data.message || "Failed to add experience");
      }
    } catch (err) {
      console.error("Add experience error:", err);
      toast.error(err.response?.data?.message || "Failed to add experience");
    }
  };

  const editExperience = (uid) => {
    setExperienceEdit(true);
    const filteredData = user.experiences.filter((experience) => {
      return experience._id === uid;
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

    enquiryref.current.style.scale = 1;
  };

  const deleteExperience = async () => {
    const uid = educationData.editId;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/delete_experience`,
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
    setExperienceEdit(false);
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
    setExperienceEdit(false);
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
          <h1>Experience</h1>
          <button onClick={() => {setIsExperience(true); openEnquiry();}}>Add Experience</button>
        </div>
        <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-3 px-sm-5">
          {
            user.experiences?.map((experience) => {
              return(
                <div key={experience._id} className='w-full d-flex gap-3 justify-content-between align-items-center'>
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
                        certificate_input_ref.current.click();
                      }}
                    >
                      <i className="fas fa-upload"></i>
                    </label>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => editExperience(experience._id)}
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
          <h2>Add Experience</h2>
          <form
            onSubmit={addExperience}
          >
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" htmlFor="institute">
                  Company Name *
                </label>
                <input
                  required
                  type="text"
                  value={educationData.institute}
                  name="institute"
                  onChange={changeHandler}
                  id="institute"
                  placeholder="Enter company name"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" htmlFor="degree">
                  Role / Position *
                </label>
                <input
                  required
                  type="text"
                  value={educationData.degree}
                  name="degree"
                  onChange={changeHandler}
                  id="degree"
                  placeholder="eg: Software Engineer"
                  autoComplete="off"
                />
              </div>  
            </div>
            <div className="input-box">
              <div className="input-div">
                <label className="form-label" htmlFor="starting_month">
                  Starting From *
                </label>
                <select
                  required
                  value={educationData.starting_month}
                  name="starting_month"
                  id="starting_month"
                  className=""
                  onChange={changeHandler}
                >
                  <option value="">Select Month</option>
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
                  Location
                </label>
                <input
                  required
                  type="text"
                  value={educationData.score}
                  name="score"
                  onChange={changeHandler}
                  id="score"
                  placeholder="Enter work location"
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
                onClick={deleteExperience}
                className="fs-6 cursor-pointer"
              >
                {experienceEdit ? "Delete this entry" : ""}
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

export default ExperienceSection;