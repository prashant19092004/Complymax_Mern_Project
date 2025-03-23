import React from 'react';
import { MdDeleteOutline, MdEdit } from "react-icons/md";

const ExperienceSection = ({ 
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
  );
};

export default ExperienceSection;