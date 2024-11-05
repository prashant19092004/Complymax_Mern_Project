import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import defaultProfile from '../../../assets/Default_pfp.svg.png';
import close from '../../../assets/close.png';
import { toast } from 'react-toastify';

const PendingWages = () => {

    const [pendinWagesList, setPendingWagesList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const [saveData, setSaveData] = useState({
        user_id : '',
        basic : '',
        da : '',
        hra : '',
        other_allowance : '',
        leave_with_wages : ''
    })
    const buttonStyle = {
        backgroundColor: 'green',
        color: 'white',
        height: '30px', // Adjust the height as needed
        padding: '0 15px', // Adjust padding for a more compact look
        fontSize: '14px', // Adjust font size if needed
        borderRadius: '5px', // Optional: Adjust border radius
      };
    const enquiryref = useRef();
    const warningref = useRef();

    const fetchingHired = async() => {
        try{
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/establishment/pending-wages`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                setPendingWagesList(res.data.pendingWages);
                setFilteredList(res.data.pendingWages);
                setLoading(false);
                console.log(res);
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

    let wagesChangeHandler = (e) => {
        const query = e.target.value;
        setSaveData({...saveData, [e.target.name] : query});
    }

    let saveWages = async() => {
        console.log(saveData);
        try{
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/establishment/save-wages`, saveData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                console.log(res);
                setPendingWagesList(res.data.pendingWages);
                setFilteredList(res.data.pendingWages);
                warningref.current.style.scale = 0;
                enquiryref.current.style.scale = 0
                toast.success(res.data.message);
            })
        }
        catch(err){
            toast.error(err.response.data.message);
        }
    }

    

    let changeHandle = (e) => {
        console.log(e.target.value);
        let query = e.target.value.toLowerCase();
  
        const filteredData = pendinWagesList && pendinWagesList.length? pendinWagesList.filter((hired) => hired.full_Name.toLowerCase().indexOf(query) > -1) : [];
        setFilteredList(filteredData);
        // setShowDropDown(true);
    }

    function toggleShow () {
        var el = document.getElementById("box");
        el.classList.toggle("show");
    }

    let openEnquiry = () => {
        const enquiry_pop_up = document.querySelector(".enquiry-section");
        enquiry_pop_up.style.scale = 1;
      }
      
      let closeEnquiry = () => {
        const enquiry_pop_up = document.querySelector(".enquiry-section");
        enquiry_pop_up.style.scale = 0;
      };

    


  return (
    <div className='supervisor_hire position-relative w-full'>
        <div className='w-full d-flex justify-content-center mt-5'>
            <h1 className='fs-2 text-center' style={{color : 'green'}}>Pending Wages</h1>
        </div>
        <div className='ragister_div' style={{paddingTop : '0px'}}>
            <div className='search_container mb-5'>
                  <input type="text" id="box" placeholder="Search...." class="search__box" onChange={changeHandle} />
                  <i class="fas fa-search search__icon" id="icon" onClick={toggleShow}></i>
            </div>
            {/* <Button className='mt-2' onClick={postHiringButtonHandler} varient='primary'>Post Hiring</Button> */}
        </div>
        <div>
            <ul className='list_box px-5' style={{padding : '0px'}}>
                {
                    filteredList?.map((user) => {
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
                                    <button class="btn custom-btn" onClick={() => {setSaveData({...saveData, user_id : user._id}); enquiryref.current.style.scale = 1; }} style={buttonStyle}>Update</button>
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
        <section ref={enquiryref} class="enquiry-section" >
          <div class="enquiry-form">
            <img onClick={() => {closeEnquiry();}} class="enquiry-close" src={close} alt="" />
            <h2>Wage Form</h2>
            {/* <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, nemo?</p> */}
            <form action="#" onSubmit={(e) => { e.preventDefault(); warningref.current.style.scale = 1 }}>
                <div class="input-box w-full">
                    <div class="input-div w-full">
                        <label class="form-label" for="institute">Basic</label>
                        <input required type="text" onChange={wagesChangeHandler} name="basic" id="basic" placeholder="Basic" autocomplete="off"/>
                    </div>
                    <div class="input-div w-full">
                        <label class="form-label" for="institute">DA</label>
                        <input required type="text" onChange={wagesChangeHandler} name="da" id="da" placeholder="DA" autocomplete="off"/>
                    </div>
                </div>
                <div class="input-box w-full">
                    <div class="input-div w-full">
                        <label class="form-label" for="institute">HRA</label>
                        <input required type="text" onChange={wagesChangeHandler} name="hra" id="hra" placeholder="HRA" autocomplete="off"/>
                    </div>
                    <div class="input-div w-full">
                        <label class="form-label" for="institute">Other Allowance</label>
                        <input required type="text" onChange={wagesChangeHandler} name="other_allowance" id="other_allowance" placeholder="Other Allowanc" autocomplete="off"/>
                    </div>
                </div>
                <div class="input-box w-full">
                    <div class="input-div w-full">
                        <label class="form-label" for="institute">Leave with Wages</label>
                        <input required type="text" onChange={wagesChangeHandler} name="leave_with_wages" id="leave_with_wages" placeholder="Leave with Wages" autocomplete="off"/>
                    </div>
                </div>
              <div className='d-flex justify-content-between align-items-center mt-2'>
                {/* <h2 onClick={() => deleteEducation()} className='fs-6 cursor-pointer'>{educationEdit ? 'Delete this entry' : ''}</h2> */}
                <button class="enquiry-button" type="submit" >Save</button>    
              </div>
            </form>
          </div>
        </section>
        <div className='warning_box' ref={warningref}>
          <div className='inner_warning_box'>
            <p>Are you Sure?</p>
            <div className='d-flex justify-content-center align-items-center gap-3'>
              <button onClick={() => {warningref.current.style.scale = 0}} style={{backgroundColor : "red"}}>No</button>
              <button style={{backgroundColor : "green"}} onClick={saveWages}>Yes</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default PendingWages;