import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Image, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { toast } from 'react-toastify';
import default_pic from '../../../assets/Default_pfp.svg.png';
import axios from 'axios';

const EmployeeDetail = () => {
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isExperience, setIsExperience] = useState(false);
    const [educationEdit, setEducationEdit] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const { state } = useLocation();

    const userId = state?.employeeId;

    async function fetchingProfile() {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/establishmant/employee-detail`,
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUser(response.data.currentUser);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load employee details. Please try again later.');
            toast.error('Failed to load employee details');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!userId) {
            return;
        }
        fetchingProfile();
    }, [userId]);

    if (!userId) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="text-center">
                    <h4 className="text-danger">Invalid Employee ID</h4>
                    <p>Please go back and try again</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="text-center">
                    <h4 className="text-danger">{error}</h4>
                    <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="text-center">
                    <h4 className="text-danger">Employee not found</h4>
                    <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </div>
        );
    }

    function addPan() {
        navigate('/establisment_dashboard/add_pan', { state: { userId } });
    }
    
    function addAccount() {
        navigate('/establisment_dashboard/add_account', { state: { userId } });
    }

    return (
        <div id="screen">
            <div id="content">
                <div className='position-relative'>
                    <img 
                        id="user-avatar" 
                        src={user?.profilePic ? `${process.env.REACT_APP_BACKEND_URL}${user.profilePic}` : default_pic} 
                        alt="Avatar" 
                    />
                </div>
                <p id="user-name">{user?.full_Name || 'N/A'}</p>
                <p id="user-location">{user?.email || 'N/A'}</p>
            </div>
            
            <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
                <div className="flex flex-col profile-content-box">
                    <dt>Aadhar No.</dt>
                    <dd>{user?.aadhar_number || 'N/A'}</dd>
                </div>
                <div className="flex flex-col profile-content-box">
                    <dt>Date Of Birth</dt>
                    <dd>{user?.dob || 'N/A'}</dd>
                </div>
                <div className="flex flex-col profile-content-box">
                    <dt>Gender</dt>
                    <dd>{user?.gender === 'M' ? 'Male' : 'Female'}</dd>
                </div>
                <div className="flex flex-col profile-content-box">
                    <dt>Phone Number</dt>
                    <dd>{user?.contact || 'N/A'}</dd>
                </div>
                <div className="flex flex-col profile-content-box">
                    <dt>State</dt>
                    <dd>{user?.state || 'N/A'}</dd>
                </div>
                <div className="flex flex-col profile-content-box">
                    <dt>Country</dt>
                    <dd>{user?.country || 'N/A'}</dd>
                </div>
            </div>

            <div className='id_sec'>
                <div className='pan_heading'>
                    <h1>Pan Card</h1>
                    <button onClick={addPan}>{user?.pan_added ? 'Change' : 'Add'}</button>
                </div>
                <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
                    <div className="flex flex-col profile-content-box">
                        <dt>Pan No.</dt>
                        <dd>{user?.pan_number || 'N/A'}</dd>
                    </div>
                    <div className="flex flex-col profile-content-box">
                        <dt>Name</dt>
                        <dd>{user?.pan_name || 'N/A'}</dd>
                    </div>
                </div>
            </div>

            <div className='id_sec'>
                <div className='pan_heading'>
                    <h1>Account</h1>
                    <button onClick={addAccount}>{user?.account_added ? 'Change' : 'Add'}</button>
                </div>
                <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
                    <div className="flex flex-col profile-content-box">
                        <dt>Account No.</dt>
                        <dd>{user?.account_number || 'N/A'}</dd>
                    </div>
                    <div className="flex flex-col profile-content-box">
                        <dt>Name</dt>
                        <dd>{user?.account_name || 'N/A'}</dd>
                    </div>
                    <div className="flex flex-col profile-content-box">
                        <dt>IFSC code</dt>
                        <dd>{user?.account_ifsc || 'N/A'}</dd>
                    </div>
                </div>
            </div>

            <div className='id_sec'>
                <div className='pan_heading'>
                    <h1>Education</h1>
                </div>
                <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-3 px-sm-5">
                    {user?.qualifications?.map((qualification, index) => (
                        <div key={index} className='w-full d-flex gap-3 justify-content-between align-items-center'>
                            <div>
                                <h1 className='fs-6'>{qualification.institute}</h1>
                                <p>{`${qualification.degree}  • ${qualification.starting_month} ${qualification.starting_year} - ${qualification.ending_month} ${qualification.ending_year}  • Score: ${qualification.score}`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='id_sec'>
                <div className='pan_heading'>
                    <h1>Experience</h1>
                </div>
                <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-3 px-sm-5">
                    {user?.experiences?.map((experience, index) => (
                        <div key={index} className='w-full d-flex gap-3 justify-content-between align-items-center'>
                            <div>
                                <h1 className='fs-6'>{experience.company}</h1>
                                <p>{`${experience.role}  • ${experience.starting_month} ${experience.starting_year} - ${experience.ending_month} ${experience.ending_year}  • Score: ${experience.location}`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetail;
