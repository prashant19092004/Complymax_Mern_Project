import React, { useState, useEffect, useRef } from 'react'
import defaultProfile from '../../assets/Default_pfp.svg.png';
import './list.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";

const ClientRegistration = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const enquiryref = useRef();
    const [clients, setClients] = useState();
    const [filteredClients, setFilteredClients] = useState();
    const [loading, setLoading] = useState(true);
    const [clientData, setClientData] = useState({
      name : "",
      email : "",
      contact : "",
      password : ""
    });

  async function fetchingProfile(){
    try{
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/establisment/clientlist`, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log(res.data.clients);
        setClients(res.data.clients);
        setFilteredClients(res.data.clients);
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
        navigate('/establisment_dashboard/client_registration_form');
    }

    function toggleShow () {
      var el = document.getElementById("box");
      el.classList.toggle("show");
    }

    let changeHandle = (e) => {
        let query = e.target.value.toLowerCase();

          const filteredData = 
              clients && clients.length? clients.filter((client) => client.name.toLowerCase().indexOf(query) > -1) : [];
          setFilteredClients(filteredData);
          // setShowDropDown(true);
    }

    let openEnquiry = () => {
      enquiryref.current.style.scale = 1;
      console.log(enquiryref.current);
    }

    let closeEnquiry = () => {
      enquiryref.current.style.scale = 0;
      setSupervisorData({
        name : "",
        email : "",
        contact : "",
        password : ""
      })
    }

    let clientChangeHandler = (e) => {
      setClientData({ ...clientData, [e.target.name] : e.target.value});
    }

    let getClientDetail = (uid) => {
      console.log(uid);
      navigate('/establisment_dashboard/client_detail', {state : uid});
    }

    let fetchClientData = (uid) => {
      const filteredData1 = clients.filter((client) => {
        return uid === client._id
      });
      setClientData(filteredData1[0]);
    }

    let cancelEdit = () => {
      enquiryref.current.style.scale = 0;
      setClientData({
        name : "",
        email : "",
        contact : "",
        password : ""
      })
    }

    let saveEdit = async() => {
      try{
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/establisment/client_edit`,
          clientData,
          {
            headers: {
              Authorization : `Bearer ${token}`
            }
          }
        )
        .then((res) => {
          if(res.data.success){
            toast.success(res.data.message);
            setClients(res.data.currentEstablisment.clients);
            setFilteredClients(res.data.currentEstablisment.clients);
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
                  <i class="fas fa-search search__icon" id="icon" onclick={toggleShow}></i>
            </div>
            <Button className='mt-2' onClick={registerButtonHandler} varient='primary'>Register</Button>
        </div>
        <ul className='list_box'>
            {
                filteredClients.map((client) => {
                    return (
                        <li className='list'>
                          <img className='' src={defaultProfile} alt='' />
                          <div className='list_content'>
                            <div className='list-left' onClick={() => getClientDetail(client._id)}>
                                <p>{client.name}</p>
                            </div>
                            <div className='list-middle'>
                                <p>{client.contact}</p>
                            </div>
                            <div className='list-right d-flex gap-3 align-items-center'>
                                <p>{client.status ? 'Active' : 'Inactive'}</p>
                                <div onClick={openEnquiry}>
                                  <FaEdit title='Edit' fontSize={18} onClick={() => fetchClientData(client._id)} />
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
                  <label class="form-label" htmlFor="name">Name</label>
                  <input required type="text" value={clientData.name} name="name" onChange={clientChangeHandler} id="name" placeholder="Name" autocomplete="off"/>
                </div>
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" htmlFor="Score">Email</label>
                  <input required type="email" value={clientData.email} name="email" onChange={clientChangeHandler} id="email" placeholder="email" autocomplete="off"/>
                </div>  
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" htmlFor="contact">Contact No.</label>
                  <input required type="contact" value={clientData.contact} name="contact" onChange={clientChangeHandler} id="contact" placeholder="contact no" autocomplete="off"/>
                </div>  
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" htmlFor="password">Password</label>
                  <input required type="text" value={clientData.password} name="password" onChange={clientChangeHandler} id="password" placeholder="Password" autocomplete="off"/>
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

export default ClientRegistration