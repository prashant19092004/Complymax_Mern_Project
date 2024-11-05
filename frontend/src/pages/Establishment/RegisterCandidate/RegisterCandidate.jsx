import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import defaultProfile from '../../../assets/Default_pfp.svg.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import close from '../../../assets/close.png';

const RegisterCandidate = () => {

    const [usersList, setUsersList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const jwtToken = localStorage.getItem('token');
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxODE4NDg1NSwianRpIjoiNDRmNzUyZDAtYzNiYy00MTQ1LThjOGItNWRjNjg3NzU2N2ZkIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmNvbXBseW1heEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxODE4NDg1NSwiZXhwIjoyMDMzNTQ0ODU1LCJlbWFpbCI6ImNvbXBseW1heEBzdXJlcGFzcy5pbyIsInRlbmFudF9pZCI6Im1haW4iLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.HZRqEIPUAx9VCS_FPoNaoMnWGcJkux8xLMjstMtNfZc";
    const navigate = useNavigate();
    const enquiryref = useRef();
    const [panNumber, setPanNumber] = useState('');
    const [registerData, setRegisterData] = useState({
        fullName : '',
        fatherName : '',
        dob : '',
        email : '',
        aadhar_no : '',
        contact : '',
        email : '',
        pan_number : ''
    })
    const [panVerified, setPanVerified] = useState(false);
    const [panData, setPanData] = useState();
    
    const buttonStyle = {
        backgroundColor: 'green',
        color: 'white',
        height: '30px', // Adjust the height as needed
        padding: '0 15px', // Adjust padding for a more compact look
        fontSize: '14px', // Adjust font size if needed
        borderRadius: '5px', // Optional: Adjust border radius
    };



    const fetchingHired = async() => {
        try{
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/establishment/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                }
            })
            .then((res) => {
                setUsersList(res.data.users);
                setFilteredList(res.data.users);
                setLoading(false);
                // console.log(res);
            })
        }
        catch(e){
            toast.error(e.response.data.message);
            setLoading(false);
        }
    }

    
    useEffect(() => {
        fetchingHired();
    }, []);

    if(loading){
        return (<div>Loading...</div>)
    }

    let verifyPan = async() => {
        try{
            await axios.post(
                "https://kyc-api.surepass.io/api/v1/pan/pan-comprehensive",
                {
                  id_number : panNumber
                }, 
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type' : 'application/json' 
                    }
                }
            )
            .then((res) => {
                if(res.status === 200 ){
                    setPanVerified(true);
                    setRegisterData({
                        ...registerData,
                        fullName : res.data.data.full_name,
                        dob : res.data.data.dob,
                        email : res.data.data.email,
                        pan_number : res.data.data.pan_number,
                        contact : res.data.data.phone_number,
                    });
                    setPanData(res.data.data);
                    toast.success("Pan Verified");
                    console.log(res);
                }
            })
        }
        catch(err){
            toast.error('Pan Verification Failed');
            // console.log(err);
        }
    }

    let registerUser = async() => {
        console.log(registerData);
        try{
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/establishment/register-user`,
                {
                    registerData,
                    panData
                },
                    {
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                    }   
                }
            )
            .then((res) => {
                console.log(res);
                closeEnquiry();
                setUsersList(res.data.users);
                setFilteredList(res.data.users);
            })
        }
        catch(err){
            console.log(err);
        }
    }

    let panChangeHandler = (e) => {
        setPanNumber(e.target.value);
    }

    let changeHandle = (e) => {
        console.log(e.target.value);
        let query = e.target.value.toLowerCase();
  
        const filteredData = usersList && usersList.length? usersList.filter((hired) => hired.full_Name.toLowerCase().indexOf(query) > -1) : [];
        setFilteredList(filteredData);
        // setShowDropDown(true);
    }

    function toggleShow () {
        var el = document.getElementById("box");
        el.classList.toggle("show");
    }

    // console.log(panData);

    let openEnquiry = () => {
        const enquiry_pop_up = document.querySelector(".enquiry-section");
        enquiry_pop_up.style.scale = 1;
      }
      
      let closeEnquiry = () => {
        const enquiry_pop_up = document.querySelector(".enquiry-section");
        enquiry_pop_up.style.scale = 0;
        setPanData();
        setPanVerified(false);
        setPanNumber('');
        setRegisterData({
            fullName : '',
            fatherName : '',
            dob : '',
            email : '',
            aadhar_no : '',
            contact : '',
            email : '',
            pan_number : ''
        });
      };

    let userDataChangeHandler = (e) => {
        setRegisterData({...registerData, [e.target.name] : e.target.value});
    }



  return (
    <div className='supervisor_hire position-relative w-full'>
        <div className='w-full d-flex justify-content-center mt-5'>
            <h1 className='fs-2 text-center' style={{color : 'green'}}>Candidate Registeration</h1>
        </div>
        <div className='ragister_div' style={{paddingTop : '0px'}}>
            <div className='search_container mb-5'>
                  <input type="text" id="box" placeholder="Search...." class="search__box" onChange={changeHandle} />
                  <i class="fas fa-search search__icon" id="icon" onClick={toggleShow}></i>
            </div>
            <Button className='mt-2' onClick={() => {enquiryref.current.style.scale = 1}} style={{height : '50px'}} varient='primary'>Register New</Button>
        </div>
        <div>
            <ul className='list_box px-5' style={{padding : '0px'}}>
                {
                    filteredList?.map((user) => {
                        return ( 
                            <li className='list'>
                                <img className='' src={defaultProfile} alt='' />
                                <div className='w-full'>
                                    <div className='list_content w-full' style={{justifyContent : 'space-between'}}>
                                        {/* <div>{user.hired.employeeId}</div> */}
                                        <div className='list-left'>
                                            <p>{user.full_Name}</p>
                                        </div>
                                        <div className='list-middle'>
                                            <p>{user.contact}</p>
                                        </div>
                                        <div className='list-right'>
                                            <button class="btn custom-btn" onClick={() => {navigate('/establisment_dashboard/employee-detail', { state : { employeeId : user._id } })}} style={buttonStyle}>View</button>
                                        </div>
                                    </div>
                                    {/* <p>Addhar No. : {user.aadhar_number}</p> */}
                                </div>  
                            </li>
                        )
                    })
                }
            </ul>
        </div>
        <section ref={enquiryref} class="enquiry-section" >
          <div class="enquiry-form">
            <img onClick={() => {closeEnquiry(); setPanNumber('')}} class="enquiry-close" src={close} alt="" />
            <h2>Register</h2>
            {/* <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, nemo?</p> */}
            <form action="#" onSubmit={(e) => { e.preventDefault(); registerUser(); }}>
                <div class="input-box w-full">
                    <div class="input-div w-full">
                        <label class="form-label" for="institute">Pan Number</label>
                        <input required type="text" onChange={panChangeHandler} name="pan_number" id="pan_number" disabled={panVerified} placeholder="Pan Number.." />
                    </div>
                </div>
                <div className='d-flex justify-content-end'>
                    <p class="" onClick={() => { if(!panVerified){verifyPan();}}} style={{backgroundColor : 'transparent', color : 'green', cursor : 'pointer' }}>{panVerified ? 'Verified' : 'varify'}</p>
                </div>
                {panVerified && 
                <>
                    <div class="input-box w-full">
                        <div class="input-div w-full">
                            <label class="form-label" for="fullName">Full Name</label>
                            <input required type="text" value={registerData.fullName} disabled={panData.full_name} onChange={userDataChangeHandler} name="fullName" id="fullName" placeholder="Name" autocomplete="off"/>
                        </div>
                    </div>
                    <div class="input-box w-full">
                        <div class="input-div w-full">
                            <label class="form-label" for="fatherName">Father Name</label>
                            <input required type="text" value={registerData.fatherName} onChange={userDataChangeHandler} name="fatherName" id="fatherName" placeholder="Father Name" autocomplete="off"/>
                        </div>
                    </div>
                    <div class="input-box w-full">
                        <div class="input-div w-full">
                            <label class="form-label" for="institute">DOB</label>
                            <input required type="date" value={registerData.dob} disabled={panData.dob} onChange={userDataChangeHandler} name="dob" id="dob" placeholder="DOB" autocomplete="off"/>
                        </div>
                    </div>
                    <div class="input-box w-full">
                        <div class="input-div w-full">
                            <label class="form-label" for="aadhar_no">Aadhar Number</label>
                            <input required type="text" value={registerData.aadhar_no} onChange={userDataChangeHandler} name="aadhar_no" id="aadhar_no" placeholder="Aadhar No." autocomplete="off"/>
                        </div>
                    </div>
                    <div class="input-box w-full">
                        <div class="input-div w-full">
                            <label class="form-label" for="contact">Mobile No.</label>
                            <input required type="text" value={registerData.contact} onChange={userDataChangeHandler} name="contact" id="contact" placeholder="Mobile No.." autocomplete="off"/>
                        </div>
                    </div>
                    <div class="input-box w-full">
                        <div class="input-div w-full">
                            <label class="form-label" for="email">Email</label>
                            <input required type="email" value={registerData.email} disabled={panData.email} onChange={userDataChangeHandler} name="email" id="email" placeholder="Email" autocomplete="off"/>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mt-2'>
                        <button class="enquiry-button" type="submit">Save</button>    
                    </div>
                </>
            }
            </form>
          </div>
        </section>
    </div>
  )
}

export default RegisterCandidate;