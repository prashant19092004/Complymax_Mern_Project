import axios from 'axios';
import React, { useEffect, useState } from 'react'
import defaultProfile from '../../../assets/Default_pfp.svg.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OfferLetter = () => {
    const [activeUsersList, setActiveUsersList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    const buttonStyle = {
        backgroundColor: 'green',
        color: 'white',
        height: '30px',
        padding: '0 15px',
        fontSize: '14px',
        borderRadius: '5px',
    };

    const fetchingEmployees = async() => {
        try {
            setLoading(true);
            console.log('Fetching employees with token:', token);
            
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client/offer-letters`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            
            console.log('Response:', response.data);

            if (response.data.success) {
                setActiveUsersList(response.data.employees);
                setFilteredList(response.data.employees);
            } else {
                toast.error(response.data.message || 'Failed to fetch employees');
            }
            setLoading(false);
        } catch(error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            toast.error(error.response?.data?.message || 'Failed to fetch employees');
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log('Component mounted, token:', token);
        if (!token) {
            toast.error('No authentication token found');
            return;
        }
        fetchingEmployees();
    }, []);

    if(loading) {
        return (<div>Loading...</div>)
    }

    const changeHandle = (e) => {
        let query = e.target.value.toLowerCase();
        const filteredData = activeUsersList?.filter((employee) => 
            employee.full_Name.toLowerCase().includes(query)
        );
        setFilteredList(filteredData);
    }

    function toggleShow() {
        var el = document.getElementById("box");
        el.classList.toggle("show");
    }

  return (
        <div className='supervisor_hire position-relative w-full'>
            <div className='w-full d-flex justify-content-center mt-5'>
                <h1 className='fs-2 text-center' style={{color: 'green'}}>Offer Letters</h1>
            </div>
            <div className='ragister_div' style={{paddingTop: '0px'}}>
                <div className='search_container mb-5'>
                    <input 
                        type="text" 
                        id="box" 
                        placeholder="Search...." 
                        className="search__box" 
                        onChange={changeHandle} 
                    />
                    <i className="fas fa-search search__icon" id="icon" onClick={toggleShow}></i>
                </div>
            </div>
            <div>
                <ul className='list_box px-5' style={{padding: '0px'}}>
                    {filteredList?.map((user, index) => (
                        <li className='list' key={index}>
                            <img className='' src={defaultProfile} alt='' />
                            <div className='w-full'>
                                <div className='list_content w-full' style={{justifyContent: 'space-between'}}>
                                    <div>{user.employeeId}</div>
                                    <div className='list-left'>
                                        <p>{user.full_Name}</p>
                                    </div>
                                    <div className='list-middle'>
                                        <p>{user.contact}</p>
                                    </div>
                                    <div className='list-right'>
                                        <button 
                                            className="btn custom-btn" 
                                            onClick={() => {
                                                navigate('/client_dashboard/send-offer-letter', { 
                                                    state: { employeeId: user._id } 
                                                })
                                            }} 
                                            style={{
                                                ...buttonStyle,
                                                backgroundColor: '#007bff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            <i className="fas fa-paper-plane"></i>
                                            Send
                                        </button>
                                    </div>
                                </div>
                                <p>Aadhar No. : {user.aadhar_number}</p>
                            </div>  
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default OfferLetter;