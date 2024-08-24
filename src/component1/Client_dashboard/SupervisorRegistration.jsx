import React, { useState, useEffect } from 'react'
import defaultProfile from '../../assets/Default_pfp.svg.png';
import './list.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SupervisorRegistration = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
    const [supervisors, setSupervisors] = useState();
    const [loading, setLoading] = useState(true);
    const [filteredSupervisors, setFilteredSupervisors] = useState();

  async function fetchingProfile(){
    try{
      await axios.get("http://localhost:9000/establisment/supervisorlist", {
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


  let getSupervisorDetail = (uid) => {
    console.log(uid);
    navigate('/establisment_dashboard/supervisor_detail', {state : uid});
  }


    return (
    <div>
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
                        <li className='list' onClick={() => getSupervisorDetail(supervisor._id)}>
                            <img className='' src={defaultProfile} alt='' />
                            <div className='list_content'>
                              <div className='list-left'>
                                  <p>{supervisor.name}</p>
                              </div>
                              <div className='list-middle'>
                                  <p>{supervisor.contact}</p>
                              </div>
                              <div className='list-right'>
                                  <p>{supervisor.status ? 'Active' : 'Inactive'}</p>
                              </div>
                            </div>
                        </li>
                    )
                })
            }
        </ul>
    </div>
  )
}

export default SupervisorRegistration