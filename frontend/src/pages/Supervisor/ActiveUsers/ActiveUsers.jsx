import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import defaultProfile from '../../../assets/Default_pfp.svg.png';
import close from '../../../assets/close.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// import { Parser } from "json2csv";
import Papa from 'papaparse';
import { FaDownload, FaSearch, FaIdCard, FaUser, FaPhone, FaAddressCard } from 'react-icons/fa';


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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/supervisor/active-users`, {
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
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
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
    <div className="container-fluid py-3 py-md-4">
        <div className="row mb-3 mb-md-4">
            <div className="col-12">
                <h1 className="text-center text-primary fw-bold mb-0">Active Employees</h1>
            </div>
        </div>

        <div className="row mb-3 mb-md-4">
            <div className="col-12 col-md-6 mx-auto">
                <div className="input-group shadow-sm">
                    <span className="input-group-text bg-white border-end-0">
                        <FaSearch className="text-muted" />
                    </span>
                    <input 
                        type="text" 
                        className="form-control border-start-0 ps-0" 
                        placeholder="Search by employee name..." 
                        onChange={changeHandle} 
                        style={{ boxShadow: 'none' }}
                    />
                    <button 
                        className="btn btn-outline-primary" 
                        onClick={downloadCSV}
                        title="Download CSV"
                    >
                        <FaDownload />
                    </button>
                </div>
            </div>
        </div>

        {/* Desktop View */}
        <div className="d-none d-md-block">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="text-center">Profile</th>
                                            <th>Employee ID</th>
                                            <th>Name</th>
                                            <th>Contact</th>
                                            <th>Aadhar Number</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredList?.map((user, index) => (
                                            <tr key={index} className="align-middle">
                                                <td className="text-center">
                                                    <img 
                                                        src={defaultProfile} 
                                                        alt="Profile" 
                                                        className="rounded-circle"
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <FaIdCard className="me-2 text-primary" />
                                                        {user.employeeId}
                                                    </div>
                                                </td>
                                                <td className="fw-medium">{user.full_Name}</td>
                                                <td>{user.contact}</td>
                                                <td>{user.aadhar_number}</td>
                                                <td className="text-center">
                                                    <button 
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => navigate('/supervisor_dashboard/employee-detail', { state: { employeeId: user._id } })}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredList.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    <div className="text-muted">
                                                        No employees found
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile View */}
        <div className="d-block d-md-none">
            <div className="row g-3">
                {filteredList?.map((user, index) => (
                    <div key={index} className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <img 
                                        src={defaultProfile} 
                                        alt="Profile" 
                                        className="rounded-circle me-3"
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <h6 className="mb-1 fw-bold">{user.full_Name}</h6>
                                        <small className="text-muted">ID: {user.employeeId}</small>
                                    </div>
                                </div>
                                <div className="row g-2">
                                    <div className="col-6">
                                        <div className="d-flex align-items-center text-muted">
                                            <FaPhone className="me-2" />
                                            <small>{user.contact}</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex align-items-center text-muted">
                                            <FaAddressCard className="me-2" />
                                            <small>{user.aadhar_number}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <button 
                                        className="btn btn-primary w-100"
                                        onClick={() => navigate('/supervisor_dashboard/employee-detail', { state: { employeeId: user._id } })}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredList.length === 0 && (
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-body text-center py-4">
                                <div className="text-muted">
                                    No employees found
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default ActiveUsers;