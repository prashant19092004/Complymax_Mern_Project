import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import default_img from '../../../assets/Default_pfp.svg.png';

const profile = () => {
  
  const [clientData, setClientData] = useState();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  let fetchingClientData = async() => {
    try{
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client/profile`, 
      {
        headers: {
          Authorization : `Bearer ${token}`
        }
      }
      )
      .then((res) => {
        setLoading(false);
        setClientData(res.data.currentClient);
      })
    }catch(err){
        toast.error('Internal Server Error');
    }
  }

  useEffect(() => {
    fetchingClientData();}, []);

  if(loading){
    return <div>Loading</div>
  }



  return (
    <div id="screen">
      <div id="content">
        <img id="user-avatar" src={default_img} alt="Avatar" />
        <p id="user-name">{clientData.name}</p>
        <p id="user-description">{clientData.email}</p>
        {/* <div id="user-general-values">
          <p>
            <span>{clientData.cli}</span>
            <span>Clients</span>
	    	  </p>
          <div class="line"></div>
          <p>
            <span>7</span>
            <span>Supervisors</span>
	    	  </p>
          <div class="line"></div>
          <p>
            <span>6</span>
            <span>Emploies</span>
	    	  </p>
        </div> */}
        {/* <p id="follow-btn">Follow</p> */}
      </div>
      <div class="container1 px-5">
        <div class="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-0 px-sm-5">
            <div class="flex flex-col profile-content-box">
              <dt>Name</dt>
              <dd>{clientData.name}</dd>
            </div>
            <div class="flex flex-col profile-content-box">
              <dt>Contact</dt>
              <dd>{clientData.contact}</dd>
            </div>
            <div class="flex flex-col profile-content-box">
              <dt>Location</dt>
              <dd>{clientData.location}</dd>
            </div>
            <div class="flex flex-col profile-content-box">
              <dt>State</dt>
              <dd>{clientData.state}</dd>
            </div>
        </div>
      </div>
    </div>
  )
}

export default profile