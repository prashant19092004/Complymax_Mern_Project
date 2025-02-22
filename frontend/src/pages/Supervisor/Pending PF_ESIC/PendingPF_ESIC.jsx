import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import defaultProfile from '../../../assets/Default_pfp.svg.png';
import close from '../../../assets/close.png';
import { toast } from 'react-toastify';

const PendingPF_ESIC = () => {

    const [pendingPfEsicList, setPendingPfEsicList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [userId, setUserId] = useState('');
    const [saveData, setSaveData] = useState({
        user_id : '',
        uan_number : '',
        epf_number : '',
        esi_number : '',
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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/supervisor/pending-pf-esic`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                setPendingPfEsicList(res.data.pendingPfEsic);
                setFilteredList(res.data.pendingPfEsic);
                setLoading(false);
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


    let pfesicChangeHandler = (e) => {
        const query = e.target.value;
        setSaveData({...saveData, [e.target.name] : query});
    }

    let file2ChangeHandler = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile2(selectedFile);
        }
    }

    let file1ChangeHandler = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile1(selectedFile);
        }
    }

    let savePfEsic = async() => {
        try{
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/supervisor/save-pf-esic`, saveData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                setPendingPfEsicList(res.data.pendingPf_Esic);
                setFilteredList(res.data.pendingPfEsic);
                warningref.current.style.scale = 0;
                enquiryref.current.style.scale = 0
                toast.success(res.data.message);
            })
        }
        catch(err){
            toast.error(err.response.data.message);
        }
    }

    const onFile1Submit = async () => {
        const formData = new FormData();
        formData.append('file1', file1);
        formData.append('userId', userId);
      
        try {
          const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload/file1`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });
          if(res.status === 200){
            onFile2Submit();
          }
        } catch (err) {
          console.error('Error uploading profile picture:', err);
          toast.error('Error uploading PDF');
        }
    };

    const onFile2Submit = async () => {
        const formData = new FormData();
        formData.append('file2', file2);
        formData.append('userId', userId);
      
        try {
          const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload/file2`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
          });
          if(res.status === 200){
            savePfEsic();
          }
        } catch (err) {
          toast.error('Error uploading PDF');
        }
    };

    
    let changeHandle = (e) => {
        let query = e.target.value.toLowerCase();
  
        const filteredData = pendingPfEsicList && pendingPfEsicList.length? pendingPfEsicList.filter((hired) => hired.full_Name.toLowerCase().indexOf(query) > -1) : [];
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
            <h1 className='fs-2 text-center' style={{color : 'green'}}>Pending PF/ESIC</h1>
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
                                        <button className="btn custom-btn" onClick={() => {
                                            setSaveData({
                                                user_id: user._id,
                                                uan_number: user.uan_number || '',
                                                epf_number: user.epf_number || '',
                                                esi_number: user.esic_number || ''
                                            });
                                            setUserId(user._id);
                                            enquiryref.current.style.scale = 1;
                                        }} style={buttonStyle}>Update</button>
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
            <img onClick={() => {closeEnquiry();}} className="enquiry-close" src={close} alt="" />
            <h2>PF/ESIC Form</h2>
            {/* <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, nemo?</p> */}
            <form action="#" onSubmit={(e) => { e.preventDefault(); warningref.current.style.scale = 1; }}>
                <div className="input-box w-full">
                    <div className="input-div w-full">
                        <label className="form-label" htmlFor="uan_number">UAN Number</label>
                        <input required type="text" value={saveData.uan_number} onChange={pfesicChangeHandler} name="uan_number" id="uan_number" placeholder="UAN Number" autoComplete="off"/>
                    </div>
                    <div className="input-div w-full">
                        <label className="form-label" htmlFor="epf_number">EPF Number</label>
                        <input required type="text" value={saveData.epf_number} onChange={pfesicChangeHandler} name="epf_number" id="epf_number" placeholder="EPF Number" autoComplete="off"/>
                    </div>
                </div>
                <div className="input-box w-full">
                    <div className="input-div w-full">
                        <label className="form-label" htmlFor="esi number">ESI Number</label>
                        <input required type="text" value={saveData.esi_number} onChange={pfesicChangeHandler} name="esi_number" id="esi_number" placeholder="ESI Number" autoComplete="off"/>
                    </div>
                    <div className="input-div w-full">
                        <label className="form-label" htmlFor="file1">File1</label>
                        <input required type="file" onChange={file1ChangeHandler} name="file1" id="file1" placeholder="Other Allowanc" autoComplete="off"/>
                    </div>
                </div>
                <div className="input-box w-full">
                    <div className="input-div w-full">
                        <label className="form-label" htmlFor="file2">File2</label>
                        <input required type="file" onChange={file2ChangeHandler} name="file2" id="file2" placeholder="Leave with Wages" autoComplete="off"/>
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
              <button style={{backgroundColor : "green"}} onClick={() => {onFile1Submit(); savePfEsic();}}>Yes</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default PendingPF_ESIC;