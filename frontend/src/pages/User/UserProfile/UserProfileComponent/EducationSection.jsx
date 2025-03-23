import React from 'react';
import { MdDeleteOutline, MdEdit } from "react-icons/md";

const EducationSection = ({ 
  user, 
  setIsExperience, 
  openEnquiry, 
  editEducation,
  handleDeleteCertificate,
  setCurrentEducationId,
  certificate_input_ref
}) => {
  return (
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
  );
};

export default EducationSection;