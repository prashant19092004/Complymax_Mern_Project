import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import defaultProfile from '../../../assets/Default_pfp.svg.png';
import close from '../../../assets/close.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// import { Parser } from "json2csv";
import Papa from 'papaparse';
import { FaDownload } from "react-icons/fa";


const ActiveUsers = () => {

    const [activeUsersList, setActiveUsersList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    const buttonStyle = {
        backgroundColor: 'green',
        color: 'white',
        height: '30px', // Adjust the height as needed
        padding: '0 15px', // Adjust padding for a more compact look
        fontSize: '14px', // Adjust font size if needed
        borderRadius: '5px', // Optional: Adjust border radius
      };

    const downloadCSV = () => {

        const selectedFields = filteredList.map(employee => ({
            // Replace 'name', 'age', 'position', etc., with the fields you want
            name: employee.full_Name,
            Father_Name : employee.care_of,
            Contact : employee.contact,
            Aadhar_No : employee.aadhar_number,
            DOB : employee.dob,
            Gender : employee.gender,
            Email : employee.email,
            Country : employee.country,
            District : employee.dist,
            House : employee.house,
            Landmark : employee.landmark,
            Loc : employee.loc,
            Post : employee.po,
            State : employee.state,
            Street : employee.street,
            SubDistrict : employee.subdist,
            Zip : employee.zip,
            pan_name : employee.pan_name,
            pan_number : employee.pan_number,
            account_name : employee.account_name,
            account_number : employee.account_number,
            Ifsc : employee.account_ifsc,
            date_of_joining : employee.date_of_joining,
            Basic : employee.basic,
            DA : employee.da,
            HRA : employee.hra,
            other_allowance : employee.other_allowance,
            leave_with_wages : employee.leave_with_wages,
            uan_number : employee.uan_number,
            epf_number : employee.epf_number,
            esi_number : employee.esi_number,
            KYC : employee.kyc
        }));
        
        // Convert the employee data to CSV format
        const csv = Papa.unparse(selectedFields);
    
        // Create a downloadable link for the CSV file
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "employee_list.csv"; // Name of the CSV file
        a.click(); // Trigger the download
    };


    const fetchingHired = async() => {
        try{
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/supervisor/active-users`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                setActiveUsersList(res.data.activeUsers);
                setFilteredList(res.data.activeUsers);
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

    let changeHandle = (e) => {
        let query = e.target.value.toLowerCase();
  
        const filteredData = activeUsersList && activeUsersList.length? activeUsersList.filter((hired) => hired.full_Name.toLowerCase().indexOf(query) > -1) : [];
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
            <h1 className='fs-2 text-center' style={{color : 'green'}}>Active Employees</h1>
        </div>
        <div className='ragister_div' style={{paddingTop : '0px', alignItems : 'center', cursor: 'pointer'}}>
            <div className='search_container mb-5'>
                  <input type="text" id="box" placeholder="Search...." class="search__box" onChange={changeHandle} />
                  <i class="fas fa-search search__icon" id="icon" onClick={toggleShow}></i>
            </div>
            <FaDownload onClick={downloadCSV} />
            {/* <Button className='mt-2' onClick={postHiringButtonHandler} varient='primary'>Post Hiring</Button> */}
        </div>
        <div>
            <ul className='list_box px-5' style={{padding : '0px'}}>
                {
                    filteredList?.map((user, index) => {
                        return ( 
                            <li className='list' key={index}>
                                <img className='' src={defaultProfile} alt='' />
                                <div className='w-full'>
                                    <div className='list_content w-full' style={{justifyContent : 'space-between'}}>
                                        <div>{user.employeeId}</div>
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
                                    <p>Addhar No. : {user.aadhar_number}</p>
                                </div>  
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    </div>
  )
}

export default ActiveUsers;