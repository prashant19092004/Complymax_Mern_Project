import React, { useState, useEffect } from 'react'
import defaultProfile from '../../assets/Default_pfp.svg.png';
import './list.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientHiring.css';

const ClientHiring = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
    const [hiringList, setHiringList] = useState();
    const [filteredHirings, setFilteredHirings] = useState();
    const [loading, setLoading] = useState(true);

  async function fetchingHiring(){
    try{
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/establisment/hirings`, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log(res);
        setHiringList(res.data.currentEstablisment.hirings);
        // setClients(res.data.clients);
        setFilteredHirings(res.data.currentEstablisment.hirings);
        setLoading(false);
        // setUser(res.data);
      })
    }catch(err){
      console.log(err);
    }
  }

  console.log(hiringList);
  useEffect(() => {
    fetchingHiring();
  }, []);

  if(loading){
    return(<div>Loading...</div>)
  }
  
    let postHiringButtonHandler = () => {
        navigate('/establisment_dashboard/post_hiring');
    }

    function toggleShow () {
      var el = document.getElementById("box");
      el.classList.toggle("show");
    }

    let changeHandle = (e) => {
        let query = e.target.value.toLowerCase();

          const filteredData = 
              hiringList && hiringList.length? hiringList.filter((hiring) => hiring.client_name.toLowerCase().indexOf(query) > -1) : [];
          setFilteredHirings(filteredData);
          // setShowDropDown(true);
    }

    let getClientDetail = (uid) => {
      console.log(uid);
      navigate('/establisment_dashboard/client_detail', {state : uid});
    }


    return (
    <div>
        <div className='ragister_div'>
            <div className='search_container'>
                  <input type="text" id="box" placeholder="Search...." class="search__box" onChange={changeHandle} />
                  <i class="fas fa-search search__icon" id="icon" onClick={toggleShow}></i>
            </div>
            <Button className='mt-2' onClick={postHiringButtonHandler} varient='primary'>Post Hiring</Button>
        </div>
        {/* <ul className='list_box'>
            {
                filteredClients.map((client) => {
                    return (
                        <li className='list' onClick={() => getClientDetail(client._id)}>
                            <div className='list-left'>
                                <img className='' src={defaultProfile} alt='' />
                                <p>{client.name}</p>
                            </div>
                            <div className='list-middle'>
                                <p>{client.contact}</p>
                            </div>
                            <div className='list-right'>
                                <p>{client.status ? 'Active' : 'Inactive'}</p>
                            </div>
                        </li>
                    )
                })
            }
        </ul> */}
        <div className='container3'>
            <div class="header">
                <div>S.No</div>
                <div>Name</div>
                <div>Job Category</div>
                <div>State</div>
                <div>Skill</div>
                <div>No. of Hiring</div>
            </div>
            {
                filteredHirings && filteredHirings.length && filteredHirings.map((hiring, index) => {
                    return (
                        <div class="job-list">
                            <div>{index+1}.</div>
                            <div>{hiring.client_name}</div>
                            <div>{hiring.job_category}</div>
                            <div>{hiring.state}</div>
                            <div>{hiring.skill}</div>
                            <div>{`${hiring.no_of_hiring-hiring.no_of_hired}/${hiring.no_of_hiring}`}</div>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default ClientHiring