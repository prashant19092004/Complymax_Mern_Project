import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import defaultProfile from '../../../assets/Default_pfp.svg.png';
import close from '../../../assets/close.png';
import { toast } from 'react-toastify';

const AllotDateofJoining = () => {

    const [hiredList, setHiredList] = useState([]);
    const [filteredHired, setFilteredHired] = useState([]);
    const [loading, setLoading] = useState(true);
    const enquiryref = useRef();
    const warningref = useRef();
    const [dateOfJoining, setDateOfJoining] = useState();
    const [chooseUser, setChooseUser] = useState();
    const token = localStorage.getItem('token');
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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/supervisor/hired`,{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                setHiredList(res.data.totalHired);
                setFilteredHired(res.data.totalHired);
                setLoading(false);
            })
        }
        catch(e){
            toast.error('Try Again..');
            setLoading(false);
        }
    }

    const assignDateOfJoining = async(e) => {
        try{
            const data = {
                dateOfJoining,
                chooseUser
            }
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/supervisor/assign-date-of-joining`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                setHiredList(res.data.totalHired);
                setFilteredHired(res.data.totalHired);
                warningref.current.style.scale = 0;
                closeEnquiry();
                toast.success(res.data.message);
            })
        }
        catch(e){
            toast.error(e.response.data.message);
        }
    }

    let changeHandle = (e) => {
        let query = e.target.value.toLowerCase();
  
        const filteredData = hiredList && hiredList.length? hiredList.filter((hired) => hired.full_Name.toLowerCase().indexOf(query) > -1) : [];
        setFilteredHired(filteredData);
        // setShowDropDown(true);
    }

    function toggleShow () {
        var el = document.getElementById("box");
        el.classList.toggle("show");
    }

    const joiningDateChangeHandler = (e) => {
        const query = e.target.value;
        setDateOfJoining(query);
    }

    let openEnquiry = () => {
        enquiryref.current.style.scale = 1;  
      }
  
      let closeEnquiry = () => {
        enquiryref.current.style.scale = 0; 
      }

    useEffect(() => {
        fetchingHired();
    }, []);

    if(loading){
        return (<div>Loading...</div>)
    }


  return (
    <div className='supervisor_hire position-relative w-full'>
        <div className='w-full d-flex justify-content-center mt-5'>
            <h1 className='fs-2 text-center' style={{color : 'green'}}>Allot Date of Joining</h1>
        </div>
        <div className='ragister_div' style={{paddingTop : '0px'}}>
            <div className='search_container mb-5'>
                  <input type="text" id="box" placeholder="Search...." className="search__box" onChange={changeHandle} />
                  <i className="fas fa-search search__icon" id="icon" onClick={toggleShow}></i>
            </div>
            {/* <Button className='mt-2' onClick={postHiringButtonHandler} varient='primary'>Post Hiring</Button> */}
        </div>
        <div>
            <ul className='list_box px-5' style={{padding : '0px'}}>
                {
                    filteredHired?.map((user) => {
                        return ( 
                            <li className='list'>
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
                                    <button className="btn custom-btn" onClick={() => {openEnquiry(); setChooseUser(user._id)}} style={buttonStyle}>Asign Date</button>
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
        <section ref={enquiryref} className="enquiry-section" >
          <div className="enquiry-form">
            <img onClick={() => {closeEnquiry(); setChooseUser('')}} className="enquiry-close" src={close} alt="" />
            <h2>Hiring</h2>
            {/* <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, nemo?</p> */}
            <form action="#" onSubmit={(e) => { e.preventDefault(); warningref.current.style.scale = 1 }}>
                <div className="input-box w-full">
                    <div className="input-div w-full">
                        <label className="form-label" htmlFor="institute">Date of Joining</label>
                        <input required type="date" onChange={joiningDateChangeHandler} name="institute" id="institute" placeholder="Which School/College have you studied at?" autoComplete="off"/>
                    </div>
                </div>
              <div className='d-flex justify-content-between align-items-center mt-2'>
                {/* <h2 onClick={() => deleteEducation()} className='fs-6 cursor-pointer'>{educationEdit ? 'Delete this entry' : ''}</h2> */}
                <button className="enquiry-button" type="submit" >Save</button>    
              </div>
            </form>
          </div>
        </section>
        <div className='warning_box' ref={warningref}>
          <div className='inner_warning_box'>
            <p>Are you Sure?</p>
            <div className='d-flex justify-content-center align-items-center gap-3'>
              <button onClick={() => {warningref.current.style.scale = 0}} style={{backgroundColor : "red"}}>No</button>
              <button style={{backgroundColor : "green"}} onClick={assignDateOfJoining}>Yes</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default AllotDateofJoining