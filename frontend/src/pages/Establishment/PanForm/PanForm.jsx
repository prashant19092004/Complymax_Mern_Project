import React, { useState } from 'react';
// import './style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PanForm = () => {
  const navigate = useNavigate();
  const [panNumber, setPanNumber] = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [panData, setPanData] = useState();
  const userToken = localStorage.getItem("token");

  const { state } = useLocation();
  let userId = state.userId;


  function changeHandler(e) {
    setPanNumber(e.target.value);
  }

  async function generatePan(e){
    e.preventDefault();
    try{
      await axios.post(
        "https://kyc-api.surepass.io/api/v1/pan/pan",
        {
          id_number : panNumber
        }, 
        {
          headers: { 
              'Authorization': `Bearer ${process.env.REACT_APP_SURPASS_TOKEN}`,
              'Content-Type' : 'application/json' 
          }
        }
      )
      .then(async(res) => {
        // console.log(res);
        if(res.data.success){
          setPanData(res.data.data);
          
          const data = {
            userId,
            panInfo : res.data.data
          }
          try{
            await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/api/establishment/user_profile/add_Pan`,
              data,
              {
                headers: {
                  Authorization : `Bearer ${userToken}`
                }
              }
            )
            .then((res) => {
              // console.log(res);
              if(res.data.success){
                navigate('/establisment_dashboard/employee-detail', { state : { employeeId : userId } })
                toast.success(res.data.message);
              }
              else{
                toast.error(res.data.message);
              }
            })
          }catch(err){
            toast.error('Try Again..')
          }
        }
      })
    }catch(err){
      toast.error('Try Again..')
    }
  }

  return (
    <div className='pan_form'>
        <div className="form-box">
            <h1 className='mb-3'>Add Pan Card</h1>
            {/* <p>Using <a href="https://getbootstrap.com">Bootstrap</a> and <a href="https://www.formbucket.com">FormBucket</a></p> */}
            <form action="#" >
                <div className="form-group">
                  <label for="pan_number">Pan Number</label>
                  <input className="form-control" id="panNumber" type="text" name="panNumber" onChange={changeHandler} />
                </div>
                {/* <div className="form-group mt-3" id='otp_box' style={{ display : `${otpGenerated ? 'block' : 'none'}`}}>
                  <label for="pan_number">OTP</label>
                  <input className="form-control" maxLength="6" id="panNumber" type="text" name="panNumber" onChange={changeHandler} />
                </div> */}
                <div className='d-flex gap-3 mt-4'>
                    <input className="btn btn-primary" onClick={generatePan} type="submit" value={otpGenerated ? 'Verify' : 'Add'} />
                    <button className="btn btn-danger" onClick={() => navigate(-1)}>Cancel</button> 
                </div>
            </form>
        </div>
    </div>
  )
}

export default PanForm