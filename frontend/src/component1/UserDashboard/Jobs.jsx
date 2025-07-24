import axios from 'axios';
import React, { useEffect, useState } from 'react'
import JobCard from '../../components/userComponents/JobCard';
import './jobs.css';
import LiveSearchSelect from '../../components/userComponents/LiveSearchSelect';
import { Button } from 'bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getToken } from '../../utils/tokenService'; // Assuming you have a utility function to get the token

const Jobs = () => {

    
    const [hirings, setHirings] = useState();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const navigate = useNavigate();

  async function fetchingProfile(){
    const token = await getToken();
    setLoading(true);
    // console.log("Hii");
    try{
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/jobdashboard`, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      .then((res) => {
        setHirings(res.data.Hirings);
        setUser(res.data.currentUser);
        setLoading(false);
      })
    }catch(err){
      toast.error('Try Again..')
    }
  }

  function searchJobByState (option) {
    const filtered = hirings.filter((hire) => {
      return (hire.state==option.label)
    })
    setHirings(filtered);
  }


  // console.log(userHistory)
  useEffect(() => {
    fetchingProfile();
  }, []);


  if(loading){
    return( <div>Loading...</div> )
  }

  
  if(user && user.job){
    navigate('/user_dashboard/dashboard');
  }

  return (
    <div className='position-relative'>
        <div className='search_div position-absolute d-flex gap-3 align-items-center' id='search_div'>
          {/* <div className="p-1 bg-light rounded rounded-pill mb-4">
            <div className="input-group">
              <input type="search" placeholder="Search Jobs by States..." aria-describedby="button-addon1" className="form-control border-0 bg-light rounded rounded-pill" />
              <div className="input-group-append">
                <button id="button-addon1" type="submit" className="btn btn-link text-primary"><i className="fa fa-search"></i></button>
              </div>
            </div>
          </div> */}
          <LiveSearchSelect searchJobByState={searchJobByState} />
          {/* <button className="search_button">Find Job</button> */}
        </div>
      <div className='d-flex gap-5 flex-wrap w-full' id='jobs_div'>
        {
          hirings && hirings.length && hirings.map((hiring) => {
            return (
              <div className='job_card_div'>
                <JobCard hiring={hiring} />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Jobs