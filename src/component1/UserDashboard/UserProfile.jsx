import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import './style.css';
import './../Home/style.css';
import './UserProfile.css';
import PanForm from './PanForm';
import { useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import close from './../../assets/close.png';
import { toast } from 'react-toastify';
import { MdDeleteOutline } from "react-icons/md";

const UserProfile = () => {

    const token = localStorage.getItem("token");
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const enquiryref = useRef();
    const experienceElement = useRef();
    const [ isExperience, setIsExperience ] = useState(false);
    const [educationEdit, setEducationEdit] = useState(false);
    // const [editId, setEditId] = useState("");

    const [educationData, setEducationData] = useState({
      institute: '',
      degree: '',
      starting_month: '',
      starting_year : '',
      ending_month:'',
      ending_year : '',
      score : '',
      description: '',
      editId : ''
    });

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = [];
for (let year = 1951; year <= 2024; year++) {
  years.push(year);
}

let changeHandler = (e) => {
  setEducationData({
    ...educationData, [e.target.name] : e.target.value
  });
}

async function fetchingProfile(){
  try{
    setLoading(true);
    await axios.get("http://localhost:9000/user/profile", {
      headers: {
        Authorization : `Bearer ${token}`
      }
    })
    .then((res) => {
      console.log(res.data);
      setUser(res.data);
      setLoading(false);
    })
  }catch(err){
    console.log(err);
  }
}

  // console.log(userHistory)
useEffect(() => {
  fetchingProfile();
}, []);

if(loading) {
  return(<div>Loading</div>)
}

function addPan() {
  navigate('/user_dashboard/add_pan');
}

function addAccount() {
  navigate('/user_dashboard/add_account');
}

let openEnquiry = () => {
  setEducationEdit(false);
  setEducationData({
      institute: '',
      degree: '',
      starting_month: '',
      starting_year : '',
      ending_month:'',
      ending_year : '',
      score : '',
      description: '',
      editId : ''
  })
  const enquiry_pop_up = document.querySelector(".enquiry-section");
  enquiry_pop_up.style.scale = 1;
}

let closeEnquiry = () => {
  setEducationEdit(false);
  setEducationData({
      institute: '',
      degree: '',
      starting_month: '',
      starting_year : '',
      ending_month:'',
      ending_year : '',
      score : '',
      description: '',
      editId : ''
  })
  const enquiry_pop_up = document.querySelector(".enquiry-section");
  enquiry_pop_up.style.scale = 0;
};

let addEducation = async() => {
  try{
    const response = await axios.post(
        `http://localhost:9000/user/${isExperience ? 'add_experience' : 'add_education'}`,
        educationData,
        {
            headers: {
              Authorization : `Bearer ${token}`
            }
        }
    )
    .then((res) => {
        console.log(res);
        if(res.data.success){
          toast.success(res.data.message);
          setUser(res.data.currentUser1);
          setEducationData({
              institute: '',
              degree: '',
              starting_month: '',
              starting_year : '',
              ending_month:'',
              ending_year : '',
              score : '',
              description: '',
              editId : ''
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

let editEducation = (uid) => {
  console.log(uid);
  // setEditId(uid);
  setEducationEdit(true);


  let filteredData;
  console.log(isExperience);
  if(isExperience){
    filteredData = user.experiences.filter((experience) => {
      return (experience._id == uid);
    });  

    setEducationData({
      institute : filteredData[0].company,
      degree : filteredData[0].role,
      starting_month : filteredData[0].starting_month,
      starting_year : filteredData[0].starting_year,
      ending_month : filteredData[0].ending_month,
      ending_year : filteredData[0].ending_year,
      score : filteredData[0].location,
      description : filteredData[0].description,
      editId : uid
    });
  }
  else{
    filteredData = user.qualifications.filter((qualification) => {
      return (qualification._id == uid);
    });

    setEducationData({
      institute : filteredData[0].institute,
      degree : filteredData[0].degree,
      starting_month : filteredData[0].starting_month,
      starting_year : filteredData[0].starting_year,
      ending_month : filteredData[0].ending_month,
      ending_year : filteredData[0].ending_year,
      score : filteredData[0].score,
      description : filteredData[0].description,
      editId : uid
    });
  }

  enquiryref.current.style.scale = 1;

}

let deleteEducation = async() => {

  const uid = educationData.editId;
  const data = {
    uid
  }
  try{
    console.log(uid);
    const response = await axios.post(
      `http://localhost:9000/user/${isExperience ? 'delete_experience' : 'delete_education'}`,
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
        setUser(res.data.currentUser);
        closeEnquiry();
      }
    })
  }catch(err){
    toast.error("try again");
  }
}

  return (
    <div id="screen">
      <div id="content">
        <img id="user-avatar" src="https://hips.hearstapps.com/hmg-prod/images/enjoying-the-view-royalty-free-image-1582838254.jpg" alt="Avatar" />
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
                <button onClick={() => {setIsExperience(false); openEnquiry();}} >Add Education</button>
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
                        <FaRegEdit onClick={() =>{setIsExperience(false); editEducation(qualification._id);}} fontSize={20} cursor="pointer" />
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
                <button onClick={() => {setIsExperience(true); openEnquiry();}}>Add Experience</button>
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
                        <FaRegEdit onClick={() => {setIsExperience(true); editEducation(experience._id);}} fontSize={20} cursor="pointer" />
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
            <h2>Add {isExperience ? 'Experience' : 'Education'}</h2>
            {/* <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, nemo?</p> */}
            <form action="#" onSubmit={(e) => { e.preventDefault(); addEducation(); }}>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="institute">{isExperience ? 'Company' : 'School/College'}</label>
                  <input required type="text" value={educationData.institute} name="institute" onChange={changeHandler} id="institute" placeholder="Which School/College have you studied at?" autocomplete="off"/>
                </div>
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="contact_no">{isExperience ? 'Role' : 'Degree'}</label>
                  <input required type="text" value={educationData.degree} name="degree" onChange={changeHandler} id="degree" placeholder="eg: B.E" autocomplete="off"/>
                </div>  
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="starting_from">Starting From</label>
                  <select placeholder="Month" value={educationData.starting_month} name='starting_month' id='starting_month' className='' onChange={changeHandler}>
                    <option value="" placeholder="Month">Month</option>
                    {
                      months.map((month) => {
                        return <option value={month} key={month}>{month}</option>
                      })
                    }
                  </select>
                </div>
                <div class="input-div">
                  <label class="form-label" for="starting_year"></label>
                  <select placeholder="Year" value={educationData.starting_year} name='starting_year' id='starting_year' className='' onChange={changeHandler}>
                    <option value="" placeholder="Year">Year</option>
                    {
                      years.map((year) => {
                        return <option value={year} key={year}>{year}</option>
                      })
                    }
                  </select>
                </div>  
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="ending_in">Ending In</label>
                  <select placeholder="Month" value={educationData.ending_month} name='ending_month' id='ending_month' className='' onChange={changeHandler}>
                    <option value="" placeholder="Month">Month</option>
                    {
                      months.map((month) => {
                        return <option value={month} key={month}>{month}</option>
                      })
                    }
                  </select>
                </div>
                <div class="input-div">
                  <label class="form-label" for="ending_year"></label>
                  <select placeholder="Year" name='ending_year' value={educationData.ending_year} id='ending_year' className='' onChange={changeHandler}>
                    <option value="" placeholder="Year">Year</option>
                    {
                      years.map((year) => {
                        return <option value={year} key={year}>{year}</option>
                      })
                    }
                  </select>
                </div>  
              </div>
              <div class="input-box">
                <div class="input-div">
                  <label class="form-label" for="Score">Score{isExperience ? 'Location' : 'Score'}</label>
                  <input required type="text" value={educationData.score} name="score" onChange={changeHandler} id="score" placeholder="eg: 80.00%" autocomplete="off"/>
                </div>  
              </div>
              <div class="input-div">
                <label class="form-label" for="email">Description</label>
                <textarea value={educationData.description} type="text" name="description" onChange={changeHandler} id="description" placeholder="Description" autocomplete="off"></textarea>
              </div>
              <div className='d-flex justify-content-between align-items-center mt-2'>
                <h2 onClick={() => deleteEducation()} className='fs-6 cursor-pointer'>{educationEdit ? 'Delete this entry' : ''}</h2>
                <button class="enquiry-button" type="submit" >Save</button>    
              </div>
            </form>
          </div>
        </section>
    </div>
  );
};

export default UserProfile;