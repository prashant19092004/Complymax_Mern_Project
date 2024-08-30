import React, { useState, useEffect, useRef } from 'react'
import defaultProfile from '../../assets/Default_pfp.svg.png';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Client_dashboard/ClientHiring.css';
import close from '../../assets/close.png';

const HiringList = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
    const [hiringList, setHiringList] = useState();
    const [filteredHirings, setFilteredHirings] = useState();
    const [loading, setLoading] = useState(true);
  const enquiryref = useRef();
  const [assignData, setAssignData] = useState({
    aadhar_no : ''
  });

  async function fetchingHiring(){
    try{
      await axios.get("http://localhost:9000/supervisor/hirings", {
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log(res);
        setHiringList(res.data.currentEstablisment.hirings);
        // setClients(res.data.clients);
        setFilteredHirings(res.data.currentEstablisment.hirings);
        setLoading(false);
        // setUser(res.data);
      })
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    fetchingHiring();
  }, []);

  if(loading){
    return(<div>Loading...</div>)
  }
  
    let postHiringButtonHandler = () => {
        navigate('/establisment_dashboard/post_hiring');
    }

    function toggleShow () {
      var el = document.getElementById("box");
      el.classList.toggle("show");
    }

    let changeHandle = (e) => {
        let query = e.target.value.toLowerCase();

          const filteredData = 
              hiringList && hiringList.length? hiringList.filter((hiring) => hiring.client_name.toLowerCase().indexOf(query) > -1) : [];
          setFilteredHirings(filteredData);
          // setShowDropDown(true);
    }

    let openEnquiry = () => {
      enquiryref.current.style.scale = 1;  
    }

    let closeEnquiry = () => {
      enquiryref.current.style.scale = 0;  
    }

    let assignDataChangeHandler = (e) => {
      setAssignData({ ...assignData, [e.target.name] : e.target.value});
    }


    return (
    <div className='supervisor_hire position-relative'>
        <div className='ragister_div'>
            <div className='search_container'>
                  <input type="text" id="box" placeholder="Search...." class="search__box" onChange={changeHandle} />
                  <i class="fas fa-search search__icon" id="icon" onClick={toggleShow}></i>
            </div>
            <Button className='mt-2' onClick={postHiringButtonHandler} varient='primary'>Post Hiring</Button>
        </div>
        <div className='container3'>
            <div class="header">
                <div>S.No</div>
                <div>Name</div>
                <div>Job Category</div>
                <div>State</div>
                <div>Skill</div>
                <div>No. of Hiring</div>
                <div></div>
            </div>
            {
                filteredHirings && filteredHirings.length && filteredHirings.map((hiring, index) => {
                    return (
                        <div class="job-list">
                            <div>{index+1}.</div>
                            <div>{hiring.client_name}</div>
                            <div>{hiring.job_category}</div>
                            <div>{hiring.state}</div>
                            <div>{hiring.skill}</div>
                            <div>{`${hiring.no_of_hiring-hiring.no_of_hired}/${hiring.no_of_hiring}`}</div>
                            <div><button className='hiring_button' onClick={() => openEnquiry()}>Assign</button></div>
                        </div>
                    )
                })
            }
        </div>
        <section ref={enquiryref} class="enquiry-section" >
          <div class="enquiry-form">
            <img onClick={closeEnquiry} class="enquiry-close" src={close} alt="" />
            <h2>Add Location</h2>
            {/* <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, nemo?</p> */}
            
            <div className='search_container border justify-content-between'>
                  <input type="text" id="box" placeholder="Aadhar No..." class="search__box" onChange={changeHandle} />
                  <i class="fas fa-search search__icon" id="icon" onClick={toggleShow}></i>
            </div>
          </div>
        </section>
    </div>
  )
}

export default HiringList