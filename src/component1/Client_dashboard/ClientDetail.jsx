import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import close from '../../assets/close.png';
import { FaRegEdit } from "react-icons/fa";
import { toast } from 'react-toastify';

const ClientDetail = () => {
  
  const [clientData, setClientData] = useState();
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const enquiryref = useRef();
  const token = localStorage.getItem("token");
  const [locationEdit, setLocationEdit] = useState(false);
  const [supervisors, setSupervisors] = useState();

  const [locationData, setLocationData] = useState({
    name : "",
    location : "",
    state : "",
    contact : "",
    email : "",
    client_id : state,
    editId : '',
    supervisor: '',
  })

  let states_of_india = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Delhi",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
]

  let fetchingClientData = async() => {
    try{
      setLoading(true);
      await axios.post("http://localhost:9000/establisment/client_data", 
      {
        state
      }
      )
      .then((res) => {
        setSupervisors(res.data.supervisors);
        setLoading(false);
        setClientData(res.data.data);
      })
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    fetchingClientData();
  }, []);

  if(loading){
    return <div>Loading</div>
  }

  let editLocation = (uid) => {
    console.log(uid);
    // setEditId(uid);
    setLocationEdit(true);
  
  
    let filteredData;
    
      filteredData = clientData.locations.filter((location) => {
        return (location._id == uid);
      });
  
      setLocationData({
        name : filteredData[0].name,
        contact : filteredData[0].contact,
        state : filteredData[0].state,
        location : filteredData[0].location,
        email : filteredData[0].email,
        supervisor : filteredData[0].supervisor,
        editId : uid
      });
  
    enquiryref.current.style.scale = 1;  
  }

  let deleteLocation = async() => {

    // console.log(locationData);
    const uid = locationData.editId;
    const supervisor_id = locationData.supervisor;
    const data = {
      uid,
      client_id : state,
      supervisor_id
    }
    try{
      console.log(uid);
      const response = await axios.post(
        `http://localhost:9000/user/delete_location`,
        data,
        {
          headers: {
            Authorization : `Bearer ${token}`
          }
        }
      )
      .then((res) => {
        if(res.data.success){
          console.log(res);
          setClientData(res.data.currentClient);
          closeEnquiry();
        }
      })
    }catch(err){
      toast.error("try again");
    }
  }

  let addLocation = async() => {
    // console.log(locationData);
    try{
      const response = await axios.post(
          `http://localhost:9000/user/add_location`,
          locationData,
          {
              headers: {
                Authorization : `Bearer ${token}`
              }
          }
      )
      .then((res) => {
          console.log(res);
          if(res.data.success){
            console.log("Hii");
            toast.success(res.data.message);
            setClientData(res.data.currentClient);
            setLocationData({
                name : "",
                location : "",
                state : "",
                contact : "",
                email : "",
                client_id : state,
                editId : '',
                supervisor : '',
            });
            closeEnquiry();
          }
          else{
            toast.error(res.data.message);
          }
      })
    }catch(err){
        console.log("try again");
    }
  }

  let changeHandler = (e) => {
    setLocationData({
      ...locationData, [e.target.name] : e.target.value
    });
  }

  let openEnquiry = () => {
    setLocationData({
        name: '',
        location: '',
        state: '',
        contact : '',
        email:'',
        client_id : state,
        editId : '',
        supervisor : '',
    })
    const enquiry_pop_up = document.querySelector(".enquiry-section");
    enquiry_pop_up.style.scale = 1;
  }
  
  let closeEnquiry = () => {
    setLocationData({
      name: '',
      location: '',
      state: '',
      contact : '',
      email:'',
      client_id : state,
      editId : '',
      supervisor : '',
  })
    const enquiry_pop_up = document.querySelector(".enquiry-section");
    enquiry_pop_up.style.scale = 0;
  };



return (
  <div id="screen">
      <div id="content">
        {/* <img id="user-avatar" src="https://hips.hearstapps.com/hmg-prod/images/enjoying-the-view-royalty-free-image-1582838254.jpg" alt="Avatar" /> */}
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
      <div className='id_sec'>
        <div className='pan_heading'>
          <h1>Locations</h1>
          <button onClick={() => {openEnquiry();}} >Add Location</button>
      </div>
      <div class="profile-content-section d-flex gap-3 justify-content-center justify-content-sm-between flex-wrap px-3 px-sm-5">
        {
          clientData.locations?.map((location) => {
            return(
              <div className='w-full d-flex gap-3 justify-content-between align-items-center'>
                <div>
                  <h1 className='fs-6'>{`${location.location}, ${location.state}`}</h1>
                  <p>{`${location.name}  • ${location.contact} • ${location.email}`}</p>
                </div>
                <div>
                  {/* <MdDeleteOutline fontSize={20} cursor="pointer" /> */}
                  <FaRegEdit onClick={() =>{editLocation(location._id);}} fontSize={20} cursor="pointer" />
                </div>
              </div>
            )
          })
        }
      </div>
      </div>
      <section ref={enquiryref} class="enquiry-section" >
          <div class="enquiry-form">
            <img onClick={closeEnquiry} class="enquiry-close" src={close} alt="" />
            <h2>Add Location</h2>
            {/* <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, nemo?</p> */}
            <form action="#" onSubmit={(e) => { e.preventDefault(); addLocation(); }}>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="institute">Name</label>
                  <input required type="text" value={locationData.name} name="name" onChange={changeHandler} id="name" placeholder="Name" autocomplete="off"/>
                </div>
              </div>
              
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="state">State</label>
                  <select onChange={changeHandler} name="state" id="state" placeholder="" value={locationData.state} required="">
                    <option value="">Select State</option>
                    {
                      states_of_india.map((state) => {
                        return(
                          <option key={state} value={state}>{state}</option>
                        )
                      })
                    }
                  </select>
                </div>
                <div class="input-div">
                  <label class="form-label" for="location">Location</label>
                  <input required type="text" value={locationData.location} name="location" onChange={changeHandler} id="location" placeholder="Location" autocomplete="off"/>
                </div>  
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="Score">Email</label>
                  <input required type="email" value={locationData.email} name="email" onChange={changeHandler} id="email" placeholder="email" autocomplete="off"/>
                </div>  
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="contact">Contact No.</label>
                  <input required type="contact" value={locationData.contact} name="contact" onChange={changeHandler} id="contact" placeholder="contact no" autocomplete="off"/>
                </div>  
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="state">Supervisor</label>
                  <select onChange={changeHandler} name="supervisor" id="supervisor" placeholder="" value={locationData.supervisor} required="">
                    <option value="">Select Supervisor</option>
                    {
                      supervisors && supervisors.length && supervisors.map((supervisor) => {
                        return(
                          <option key={supervisor.name} value={`${supervisor._id},${supervisor.name}`}>{supervisor.name}</option>
                        )
                      })
                    }
                  </select>
                </div>  
              </div>
              <div className='d-flex justify-content-between align-items-center mt-2'>
                <h2 onClick={() => deleteLocation()} className='fs-6 cursor-pointer'>{locationEdit ? 'Delete this entry' : ''}</h2>
                <button class="enquiry-button" type="submit" >Save</button>    
              </div>
            </form>
          </div>
        </section>
  </div>
)
}

export default ClientDetail