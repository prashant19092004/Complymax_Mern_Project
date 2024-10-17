import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { toast } from 'react-toastify';
import default_pic from '../../../assets/Default_pfp.svg.png';
import axios from 'axios';

const EmployeeDetail = () => {

    const token = localStorage.getItem("token");
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [ isExperience, setIsExperience ] = useState(false);
    const [educationEdit, setEducationEdit] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const { state } = useLocation();


    console.log(state);
    let userId = state.employeeId;

    async function fetchingProfile(){
      console.log("Hiii");
      try{
        setLoading(true);
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/establishmant/employee-detail`,{
          userId
        },
        {
          headers: {
            Authorization : `Bearer ${token}`
          }
        })
        .then((res) => {
          // console.log(res.data);
          setUser(res.data.currentUser);
          setLoading(false);
        })
      }catch(err){
        console.log(err);
      }
    }

    function addPan() {
      navigate('/establisment_dashboard/add_pan', { state : { userId } });
    }
    
    function addAccount() {
      navigate('/establisment_dashboard/add_account', { state : { userId } });
    }

useEffect(() => fetchingProfile, []);
    

if(loading) {
  return(<div>Loading</div>)
}

  return (
    <div id="screen">
      <div id="content">
        <div className='position-relative'>
          <img id="user-avatar" src={user.profilePic ? `${process.env.REACT_APP_BACKEND_URL}/${user.profilePic}` : default_pic} alt="Avatar" />
          
        </div>
        <p id="user-name">{user.full_Name}</p>
        <p id="user-location">{user.email}</p>
        {/* <p id="user-description">Photos rom all over the world</p> */}
        {/* <div id="user-general-values">
          <p>
            <span>231</span>
            <span>Posts</span>
	    	  </p>
          <div class="line"></div>
          <p>
            <span>531</span>
            <span>Followers</span>
	    	  </p>
          <div class="line"></div>
          <p>
            <span>123</span>
            <span>Following</span>
	    	  </p>
        </div> */}
        {/* <p id="follow-btn">Follow</p> */}
      </div>
      <div class="container1 px-5">
        <div class="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
            <div class="flex flex-col profile-content-box">
              <dt>Aadhar No.</dt>
              <dd>{user.aadhar_number}</dd>
            </div>
            <div class="flex flex-col profile-content-box">
              <dt>Date Of Birth</dt>
              <dd>{user.dob}</dd>
            </div>
            <div class="flex flex-col profile-content-box">
              <dt>Gender</dt>
              <dd>{user.gender === 'M' ? 'Male' : 'Female'}</dd>
            </div>
            <div class="flex flex-col profile-content-box">
              <dt>Phone Number</dt>
              <dd>{user.contact}</dd>
            </div>
            <div class="flex flex-col profile-content-box">
              <dt>State</dt>
              <dd>{user.state}</dd>
            </div>
            <div class="flex flex-col profile-content-box">
              <dt>Country</dt>
              <dd>{user.country}</dd>
            </div>
        </div>
      </div>
        <div className='id_sec'>
            <div className='pan_heading'>
                <h1>Pan Card</h1>
                <button onClick={addPan} >{user.pan_added ? 'Change' : 'Add'}</button>
            </div>
            <div class="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
              <div class="flex flex-col profile-content-box">
                <dt>Pan No.</dt>
                <dd>{user.pan_number}</dd>
              </div>
              <div class="flex flex-col profile-content-box">
                <dt>Name</dt>
                <dd>{user.pan_name}</dd>
              </div>
            </div>
        </div>
        <div className='id_sec'>
            <div className='pan_heading'>
                <h1>Account</h1>
                <button onClick={addAccount} >{user.account_added ? 'Change' : 'Add'}</button>
            </div>
            <div class="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
              <div class="flex flex-col profile-content-box">
                <dt>Account No.</dt>
                <dd>{user.account_number}</dd>
              </div>
              <div class="flex flex-col profile-content-box">
                <dt>Name</dt>
                <dd>{user.account_name}</dd>
              </div>
              <div class="flex flex-col profile-content-box">
                <dt>IFSC code</dt>
                <dd>{user.account_ifsc}</dd>
              </div>
            </div>
        </div>
        <div className='id_sec'>
            <div className='pan_heading'>
                <h1>Education</h1>
                {/* <button onClick={() => {setIsExperience(false); openEnquiry();}} >Add Education</button> */}
            </div>
            <div class="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-3 px-sm-5">
              {
                user.qualifications?.map((qualification) => {
                  return(
                    <div className='w-full d-flex gap-3 justify-content-between align-items-center'>
                      <div>
                        <h1 className='fs-6'>{qualification.institute}</h1>
                        <p>{`${qualification.degree}  • ${qualification.starting_month} ${qualification.starting_year} - ${qualification.ending_month} ${qualification.ending_year}  • Score: ${qualification.score}`}</p>
                      </div>
                      <div>
                        {/* <MdDeleteOutline fontSize={20} cursor="pointer" /> */}
                        {/* <FaRegEdit onClick={() =>{setIsExperience(false); editEducation(qualification._id);}} fontSize={20} cursor="pointer" /> */}
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
                {/* <button onClick={() => {setIsExperience(true); openEnquiry();}}>Add Experience</button> */}
            </div>
            <div class="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-3 px-sm-5">
              {
                user.experiences?.map((experience) => {
                  return(
                    <div className='w-full d-flex gap-3 justify-content-between align-items-center'>
                      <div>
                        <h1 className='fs-6'>{experience.company}</h1>
                        <p>{`${experience.role}  • ${experience.starting_month} ${experience.starting_year} - ${experience.ending_month} ${experience.ending_year}  • Score: ${experience.location}`}</p>
                      </div>
                      <div>
                        {/* <MdDeleteOutline fontSize={20} cursor="pointer" /> */}
                        {/* <FaRegEdit onClick={() => {setIsExperience(true); editEducation(experience._id);}} fontSize={20} cursor="pointer" /> */}
                      </div>
                    </div>
                  )
                })
              }
            </div>
        </div>
    </div>
  );
};

export default EmployeeDetail;
