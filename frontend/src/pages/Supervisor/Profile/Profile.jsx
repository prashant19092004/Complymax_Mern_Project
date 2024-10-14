import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import default_img from '../../../assets/Default_pfp.svg.png';

const profile = () => {
  
  const [supervisorData, setSupervisorData] = useState();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  let fetchingSupervisorData = async() => {
    try{
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/supervisor/profile`, 
      {
        headers: {
          Authorization : `Bearer ${token}`
        }
      }
      )
      .then((res) => {
        console.log(res);
        setLoading(false);
        setSupervisorData(res.data.currentSupervisor);
      })
    }catch(err){
      toast.error('Internal Server Error');
    }
  }

  useEffect(() => {
    fetchingSupervisorData();}, []);

  if(loading){
    return <div>Loading</div>
  }



  return (
    <div id="screen">
      <div id="content">
        <img id="user-avatar" src={default_img} alt="Avatar" />
        <p id="user-name">{supervisorData.name}</p>
        <p id="user-description">{supervisorData.email}</p>
        {/* <div id="user-general-values">
          <p>
            <span>{supervisorData.cli}</span>
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
              <dd>{supervisorData.name}</dd>
            </div>
            <div class="flex flex-col profile-content-box">
              <dt>Contact</dt>
              <dd>{supervisorData.contact}</dd>
            </div>
            <div class="flex flex-col profile-content-box">
              <dt>Location</dt>
              <dd>{supervisorData.location}</dd>
            </div>
            <div class="flex flex-col profile-content-box">
              <dt>State</dt>
              <dd>{supervisorData.state}</dd>
            </div>
        </div>
      </div>
    </div>
  )
}

export default profile