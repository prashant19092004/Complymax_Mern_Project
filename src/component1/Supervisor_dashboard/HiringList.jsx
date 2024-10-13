import React, { useState, useEffect, useRef } from 'react'
import defaultProfile from '../../assets/Default_pfp.svg.png';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Client_dashboard/ClientHiring.css';
import close from '../../assets/close.png';
import './style.css';
import { toast } from 'react-toastify';

const HiringList = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [hiringList, setHiringList] = useState();
  const [filteredHirings, setFilteredHirings] = useState();
  const [loading, setLoading] = useState(true);
  const enquiryref = useRef();
  const warningref = useRef();
  const [assignData, setAssignData] = useState({
    user_id : '',
    hiring_id : '',
  });
  const [assignedUserId, setAssignedUserId] = useState('');
  const [users, setUsers] = useState();
  const buttonStyle = {
    backgroundColor: 'green',
    color: 'white',
    height: '30px', // Adjust the height as needed
    padding: '0 15px', // Adjust padding for a more compact look
    fontSize: '14px', // Adjust font size if needed
    borderRadius: '5px', // Optional: Adjust border radius
  };
  const [filteredUsers, setFilteredUsers] = useState();
  const [search, setSearch] = useState('');

  async function fetchingHiring(){
    try{
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/supervisor/hirings`, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      .then((res) => {
        setHiringList(res.data.requiredHirings);
        // setClients(res.data.clients);
        setFilteredHirings(res.data.requiredHirings);
        setUsers(res.data.users);
        // setFilteredUsers(res.data.users);
        setLoading(false);
        // setUser(res.data);
      })
    }catch(err){
      toast.error('Try Again..')
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

    let openEnquiry = () => {
      enquiryref.current.style.scale = 1;  
    }

    let closeEnquiry = () => {
      enquiryref.current.style.scale = 0;
      setFilteredUsers([]);
      setSearch('');  
    }

    let assignDataChangeHandler = (e) => {
      setAssignData({ ...assignData, [e.target.name] : e.target.value});
    }

    let changeHandle = (e) => {
      let query = e.target.value.toLowerCase();

        const filteredData = hiringList && hiringList.length? hiringList.filter((hiring) => hiring.client_name.toLowerCase().indexOf(query) > -1) : [];
        setFilteredHirings(filteredData);
        // setShowDropDown(true);
    }

    let userSearchHandler = () => {
      const filteredData = users && users.length? users.filter((user) => user.aadhar_number.indexOf(search) > -1): [];
      setFilteredUsers(filteredData);
    }

    let userSearchChangeHandler = (e) => {
      setSearch(e.target.value);
    }

    let hireUser = async() => {
      try{
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/supervisor/hire`,
          assignData,
          {
            headers: {
              Authorization : `Bearer ${token}`
            }
          }
        )
        .then((res) => {
          if(res.data.success){
            warningref.current.style.scale = 0;
            closeEnquiry();
            toast.success(res.data.message);
            setHiringList(res.data.requiredHirings);
            setFilteredHirings(res.data.requiredHirings);
            setUsers(res.data.users);
          }
        })
      }
      catch(e){
        warningref.current.style.scale = 0;
        closeEnquiry();
        toast.error(e.response.data.message);
      }
    }

    return (
    <div className='supervisor_hire position-relative'>
        <div className='ragister_div'>
            <div className='search_container'>
                  <input type="text" id="box" placeholder="Search...." className="search__box" onChange={changeHandle} />
                  <i className="fas fa-search search__icon" id="icon" onClick={toggleShow}></i>
            </div>
            {/* <Button className='mt-2' onClick={postHiringButtonHandler} varient='primary'>Post Hiring</Button> */}
        </div>
        <div className='container3'>
            <div className="header">
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
                        <div className="job-list" key={index}>
                            <div>{index+1}.</div>
                            <div>{hiring.client_name}</div>
                            <div>{hiring.job_category}</div>
                            <div>{hiring.state}</div>
                            <div>{hiring.skill}</div>
                            <div>{`${hiring.no_of_hiring-hiring.no_of_hired}/${hiring.no_of_hiring}`}</div>
                            <div><button className='hiring_button' onClick={() => {setAssignData({...assignData, hiring_id : hiring._id}); openEnquiry()}}>Assign</button></div>
                        </div>
                    )
                })
            }
        </div>
        <div className='warning_box' ref={warningref}>
          <div className='inner_warning_box'>
            <p>Are you Sure?</p>
            <div className='d-flex justify-content-center align-items-center gap-3'>
              <button onClick={() => {warningref.current.style.scale = 0}} style={{backgroundColor : "red"}}>No</button>
              <button style={{backgroundColor : "green"}} onClick={hireUser}>Yes</button>
            </div>
          </div>
        </div>
        <section ref={enquiryref} className="enquiry-section" >
          <div className="enquiry-form">
            <img onClick={closeEnquiry} className="enquiry-close" src={close} alt="" />
            <h2>Hiring</h2>
            {/* <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, nemo?</p> */}
            
            <div className='search_container border justify-content-between'>
                  <input type="text" id="box" value={search} placeholder="Aadhar No..." style={{width : '80%'}} className="search__box" onChange={userSearchChangeHandler} />
                  <i className="fas fa-search search__icon" id="icon" onClick={userSearchHandler}></i>
            </div>

            <ul className='list_box' style={{padding : '0px'}}>
            {
                filteredUsers?.map((user, index) => {
                    return ( 
                        <li className='list' key={index}>
                          <img className='' src={defaultProfile} alt='' />
                          <div className='w-full'>
                            <div className='list_content'>
                              <div className='list-left'>
                                  <p>{user.full_Name}</p>
                              </div>
                              <div className='list-middle'>
                                  <p>{user.contact}</p>
                              </div>
                              <div className='list-right'>
                                <button className="btn custom-btn" onClick={() => {setAssignData({...assignData, user_id : user._id}); warningref.current.style.scale = 1; }} style={buttonStyle}>Hire</button>
                              </div>
                            </div>
                            <p>Addhar No. : {user.aadhar_number}</p>
                          </div>  
                        </li>
                     )
                })
            }
            </ul>
          </div>
        </section>
    </div>
  )
}

export default HiringList