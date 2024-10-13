import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMobileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdDateRange } from "react-icons/md";

const JobCard = ({hiring}) => {
    const navigate = useNavigate();
    return (
        <div className="card border shadow-sm">
            <div className="card-body">
                {/* Employee Info */}
                <h4 className="card-title text-success mb-0">{hiring.job_category}</h4>
                <p className="text-muted small mb-0">{hiring.establisment.name}</p>
            </div>
            <hr className='m-0' />
            
            {/* Contact Details */}
            <div className="card-body">
                <div className="text-start small text-secondary">
                    <div className="d-flex align-items-center justify-content-start w-full">
                        <div>
                          <FaEnvelope className="me-2 text-muted" />
                        </div>
                        <div className='card_email_div'>
                          <p >{hiring.location_id.email}</p>
                        </div>
                    </div>
                    <p className="d-flex align-items-center mt-2">
                        <div>
                          <FaMobileAlt className="me-2 text-muted" />
                        </div>
                        {hiring.location_id.contact}
                    </p>
                    {/* <p className="d-flex align-items-center mt-2">
                        <div>
                          <MdDateRange className="me-2 text-muted" />
                        </div>
                        {props.employee.dateOfJoining.split('T')[0]}
                        19-09-2024
                    </p> */}
                    <p className="mt-2">
                        <strong>Skill: </strong> {hiring.skill}
                    </p>
                    <p className="mt-2">
                        <strong>Hirings: </strong> {hiring.no_of_hiring}
                    </p>
                    <p className="mt-2">
                        <strong>{`${hiring.location}, ${hiring.state}`}</strong>
                    </p>
                    {/* <div className="d-flex justify-content-center mt-3">
                        <button onClick={() => props.employeeProfile(props.employee.employeeId)} className="btn btn-primary">
                            View Detail
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default JobCard;
