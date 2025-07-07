import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import './style.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

const EstablismentProfile = () => {

    const token = localStorage.getItem("token");
    const [establisment, setEstablisment] = useState();
    const [loading, setLoading] = useState(true);

  async function fetchingProfile(){
    try{
        setLoading(true);
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/establishment/dashboard`, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log(res.data);
        setEstablisment(res.data);
        setLoading(false);
      })
    }catch(err){
      console.log(err);
    }
  }

  console.log(establisment);
  useEffect(() => {
    fetchingProfile();
  }, []);

  if(loading) {
    return(<div>Loading</div>)
  }


  return (
    <div id="screen">
      <div id="content">
        <img id="user-avatar" src="https://hips.hearstapps.com/hmg-prod/images/enjoying-the-view-royalty-free-image-1582838254.jpg" alt="Avatar" />
        <p id="user-name">{establisment.name}</p>
        <p id="user-description">{establisment.email}</p>
        <div id="user-general-values">
          <p>
            <span>{establisment.clients.length}</span>
            <span>Clients</span>
	    	  </p>
          <div className="line"></div>
          <p>
            <span>{establisment.supervisors.length}</span>
            <span>Supervisors</span>
	    	  </p>
          <div className="line"></div>
          <p>
            <span>{establisment.users.length}</span>
            <span>Emploies</span>
	    	  </p>
        </div>
        {/* <p id="follow-btn">Follow</p> */}
      </div>
      <div className="container1 px-5">
        <div className="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
            <div className="flex flex-col profile-content-box">
              <dt>First Name</dt>
              <dd>Samuel</dd>
            </div>
            <div className="flex flex-col profile-content-box">
              <dt>Last Name</dt>
              <dd>Abera</dd>
            </div>
            <div className="flex flex-col profile-content-box">
              <dt>Date Of Birth</dt>
              <dd>21/02/1997</dd>
            </div>
            <div className="flex flex-col profile-content-box">
              <dt>Gender</dt>
              <dd>Male</dd>
            </div>
            <div className="flex flex-col profile-content-box">
              <dt>Location</dt>
              <dd>Ethiopia, Addis Ababa</dd>
            </div>
            <div className="flex flex-col profile-content-box">
              <dt>Phone Number</dt>
              <dd>+251913****30</dd>
            </div>
            <div className="flex flex-col profile-content-box">
              <dt>Email</dt>
              <dd>samuelabera87@gmail.com</dd>
            </div>
            <div className="flex flex-col profile-content-box">
              <dt>Website</dt>
              <dd>https://www.teclick.com</dd>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EstablismentProfile;
