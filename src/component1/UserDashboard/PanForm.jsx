import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PanForm = () => {
  const navigate = useNavigate();
  const [panNumber, setPanNumber] = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false);
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxODE4NDg1NSwianRpIjoiNDRmNzUyZDAtYzNiYy00MTQ1LThjOGItNWRjNjg3NzU2N2ZkIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmNvbXBseW1heEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxODE4NDg1NSwiZXhwIjoyMDMzNTQ0ODU1LCJlbWFpbCI6ImNvbXBseW1heEBzdXJlcGFzcy5pbyIsInRlbmFudF9pZCI6Im1haW4iLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.HZRqEIPUAx9VCS_FPoNaoMnWGcJkux8xLMjstMtNfZc";
  const [panData, setPanData] = useState();
  const userToken = localStorage.getItem("token");


  function changeHandler(e) {
    setPanNumber(e.target.value);
  }

  async function generatePan(e){
    e.preventDefault();
    console.log("Hii");
    try{
      await axios.post(
        "https://kyc-api.surepass.io/api/v1/pan/pan",
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
      .then(async(res) => {
        // console.log(res);
        if(res.data.success){
          setPanData(res.data.data);
          console.log(res.data.data);
          
          try{
            await axios.post(
              "http://localhost:9000/user/profile/add_Pan",
              res.data.data,
              {
                headers: {
                  Authorization : `Bearer ${userToken}`
                }
              }
            )
            .then((res) => {
              // console.log(res);
              if(res.data.success){
                navigate("/user_dashboard/user_profile");
                toast.success(res.data.message);
              }
              else{
                toast.error(res.data.message);
              }
            })
          }catch(err){
            console.log(err);
          }
        }
      })
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className='pan_form'>
        <div class="form-box">
            <h1 className='mb-3'>Add Pan Card</h1>
            {/* <p>Using <a href="https://getbootstrap.com">Bootstrap</a> and <a href="https://www.formbucket.com">FormBucket</a></p> */}
            <form action="#" >
                <div class="form-group">
                  <label for="pan_number">Pan Number</label>
                  <input class="form-control" id="panNumber" type="text" name="panNumber" onChange={changeHandler} />
                </div>
                {/* <div class="form-group mt-3" id='otp_box' style={{ display : `${otpGenerated ? 'block' : 'none'}`}}>
                  <label for="pan_number">OTP</label>
                  <input class="form-control" maxLength="6" id="panNumber" type="text" name="panNumber" onChange={changeHandler} />
                </div> */}
                <div className='d-flex gap-3 mt-4'>
                    <input class="btn btn-primary" onClick={generatePan} type="submit" value={otpGenerated ? 'Verify' : 'Add'} />
                    <button class="btn btn-danger" onClick={() => navigate(-1)}>Cancel</button> 
                </div>
            </form>
        </div>
    </div>
  )
}

export default PanForm