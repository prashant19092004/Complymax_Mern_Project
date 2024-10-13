import React, { useState, useEffect, useRef } from 'react'
import defaultProfile from '../../assets/Default_pfp.svg.png';
import { FaEdit } from "react-icons/fa";
import close from '../../assets/close.png';
import './list.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SupervisorRegistration = () => {
  const navigate = useNavigate();
  const enquiryref = useRef();
  const token = localStorage.getItem("token");
  const [supervisors, setSupervisors] = useState();
  const [loading, setLoading] = useState(true);
  const [filteredSupervisors, setFilteredSupervisors] = useState();
  const [supervisorData, setSupervisorData] = useState({
    name : "",
    email : "",
    contact : "",
    password : ""
  });

  async function fetchingProfile(){
    try{
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/establisment/supervisorlist`, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log(res.data.supervisors);
        setSupervisors(res.data.supervisors);
        setFilteredSupervisors(res.data.supervisors);
        setLoading(false);
        // setUser(res.data);
      })
    }catch(err){
      console.log(err);
    }
  }

  // console.log(userHistory)
  useEffect(() => {
    fetchingProfile();
  }, []);

  if(loading){
    return(<div>Loading...</div>)
  }
  
    let registerButtonHandler = () => {
        navigate('/establisment_dashboard/supervisor_registration_form');
    }

    let changeHandle = (e) => {
      let query = e.target.value.toLowerCase();

        const filteredData = 
            supervisors && supervisors.length? supervisors.filter((supervisor) => supervisor.name.toLowerCase().indexOf(query) > -1) : [];
        setFilteredSupervisors(filteredData);
        // setShowDropDown(true);
  }

  let openEnquiry = () => {
    enquiryref.current.style.scale = 1;
    console.log(enquiryref.current);
  }
  // openEnquiry();

  let closeEnquiry = () => {
    enquiryref.current.style.scale = 0;
    setSupervisorData({
      name : "",
      email : "",
      contact : "",
      password : ""
    })
  }

  let supervisorChangeHandler = (e) => {
    setSupervisorData({ ...supervisorData, [e.target.name] : e.target.value});
  }


  let getSupervisorDetail = (uid) => {
    console.log(uid);
    navigate('/establisment_dashboard/supervisor_detail', {state : uid});
  }

  let fetchSupervisorData = (uid) => {
    const filteredData1 = supervisors.filter((supervisor) => {
      return uid === supervisor._id
    });
    setSupervisorData(filteredData1[0]);
  }

  let cancelEdit = () => {
    enquiryref.current.style.scale = 0;
    setSupervisorData({
      name : "",
      email : "",
      contact : "",
      password : ""
    })
  }

  let saveEdit = async() => {
    try{
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/establisment/supervisor_edit`,
        supervisorData,
        {
          headers: {
            Authorization : `Bearer ${token}`
          }
        }
      )
      .then((res) => {
        if(res.data.success){
          setSupervisors(res.data.currentEstablisment.supervisors);
          setFilteredSupervisors(res.data.currentEstablisment.supervisors);
          toast.success(res.data.message);
          closeEnquiry();
        }
        else{
          toast.error("Try Again");
        }
      })
    }
    catch(e){
      console.log(e);
    }
  }


    return (
    <div id='screen'>
        <div className='ragister_div'>
            <div className='search_container'>
                  <input type="text" id="box" placeholder="Search...." class="search__box" onChange={changeHandle} />
                  <i class="fas fa-search search__icon" id="icon"></i>
            </div>
            <Button className='mt-2' onClick={registerButtonHandler} varient='primary'>Register</Button>
        </div>
        <ul className='list_box'>
            {
                filteredSupervisors.map((supervisor) => {
                    return (
                        <li className='list'>
                            <img className='' src={defaultProfile} alt='' />
                            <div className='list_content'>
                              <div className='list-left' onClick={() => getSupervisorDetail(supervisor._id)}>
                                  <p>{supervisor.name}</p>
                              </div>
                              <div className='list-middle'>
                                  <p>{supervisor.contact}</p>
                              </div>
                              <div className='list-right d-flex gap-3 align-items-center'>
                                  <p>{supervisor.status ? 'Active' : 'Inactive'}</p>
                                  <div onClick={openEnquiry}>
                                    <FaEdit title='Edit' fontSize={18} onClick={() => fetchSupervisorData(supervisor._id)} />
                                  </div>
                              </div>
                            </div>
                        </li>
                    )
                })
            }
        </ul>
        <section ref={enquiryref} class="enquiry-section" >
          <div class="enquiry-form">
            <img onClick={closeEnquiry} class="enquiry-close" src={close} alt="" />
            <h2>Edit Supervisor Data</h2>
            {/* <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, nemo?</p> */}
            <form action="#" onSubmit={(e) => { e.preventDefault(); saveEdit(); }}>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="name">Name</label>
                  <input required type="text" value={supervisorData.name} name="name" onChange={supervisorChangeHandler} id="name" placeholder="Name" autocomplete="off"/>
                </div>
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="Score">Email</label>
                  <input required type="email" value={supervisorData.email} name="email" onChange={supervisorChangeHandler} id="email" placeholder="email" autocomplete="off"/>
                </div>  
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="contact">Contact No.</label>
                  <input required type="contact" value={supervisorData.contact} name="contact" onChange={supervisorChangeHandler} id="contact" placeholder="contact no" autocomplete="off"/>
                </div>  
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="password">Password</label>
                  <input required type="text" value={supervisorData.password} name="password" onChange={supervisorChangeHandler} id="password" placeholder="Password" autocomplete="off"/>
                </div>  
              </div>
              <div className='d-flex justify-content-between align-items-center mt-2'>
                {/* <h2 className='fs-6 cursor-pointer'></h2> */}
                <div className='d-flex gap-3'>
                  <button onClick={cancelEdit} className='enquiry-button bg-danger' style={{width : '70px'}}>Cancel</button> 
                  <button class="enquiry-button" type="submit" style={{width : '70px'}}>Save</button>    
                </div>
              </div>
            </form>
          </div>
        </section>
    </div>
  )
}

export default SupervisorRegistration