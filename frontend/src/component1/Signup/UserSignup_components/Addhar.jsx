import React, { useState } from 'react'
import ShowNext from './ShowNext';
import OtpForm from './OtpForm';
import axios from 'axios';
import './../UserSignup.css';
import { Form, Button, Image, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DetailForm from './DetailForm';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";


const Addhar = () => {

    const navigate = useNavigate();
    const [optGenerator, setOtpGenerator] = useState(false);
    const [detailForm, setDetailForm] = useState(false);
    const [clientId, setClientId] = useState("")
    const [aadharNumber, setAadharNumber] = useState({
        aNumber : "",
    });
    const [aadharData, setAadharData] = useState();
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxODE4NDg1NSwianRpIjoiNDRmNzUyZDAtYzNiYy00MTQ1LThjOGItNWRjNjg3NzU2N2ZkIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmNvbXBseW1heEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxODE4NDg1NSwiZXhwIjoyMDMzNTQ0ODU1LCJlbWFpbCI6ImNvbXBseW1heEBzdXJlcGFzcy5pbyIsInRlbmFudF9pZCI6Im1haW4iLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.HZRqEIPUAx9VCS_FPoNaoMnWGcJkux8xLMjstMtNfZc";
    const [userDetail, setUserDetail] = useState({
        name : "",
        contact : "",
        email : "",
        password : "",
        confirm_password : ""
    })

    function changeHandler(e){
        setUserDetail({...userDetail, [e.target.name] : e.target.value});
    }


    function aadharNumberHandler(event){
        setAadharNumber({...aadharNumber, [event.target.name] : event.target.value})
    };


    async function generateOtp(e){
        e.preventDefault();
        try{
            await axios.post(
                "https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp", 
                {
                    id_number : aadharNumber.aNumber
                }, 
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type' : 'application/json' 
                    }
                }
            ).then(response => {
                if(response.data.success === true){
                    setOtpGenerator(true);
                }
                setClientId(response.data.data.client_id)
                // console.log(response);
                // console.log(clientId);
            });
        }catch(err){
            console.log(err);
        }
    }

    async function VerifyOtp(e, userOtp) {
        e.preventDefault();
        console.log(userOtp);
        let data = {
            client_id : clientId,
            otp : userOtp
        }
        try{
            await axios.post(
                "https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp", 
                data, 
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type' : 'application/json' 
                    }
                }
            ).then(response => {
                console.log(response.data.data);
                if(response.data.success === true){
                    console.log("one");
                    setAadharData(response.data.data);
                    let userSignupData = {
                        userDetail : userDetail,
                        aadharData : response.data.data
                    }
                
                    // e.preventDefault();
                    // console.log(userDetail);
                    
                    if (userDetail.password !== userDetail.confirm_password) {
                      return toast.error("password !== confirm password does not match");
                    }
                    
                    try {
                      axios.post(
                        `${process.env.REACT_APP_BACKEND_URL}/usersignup`,
                        userSignupData
                      )
                      .then((response) => {
                        navigate("/user_login")
                        toast.success(response.data.message);
                      }) 
                    } catch (err) {
                      toast.error(err.response.data.Message);
                    }
                }
                // setAadharData(response.data.data);
                // setOtpGenerator(false);
                // setDetailForm(true);
            });
        }catch(err){
            console.log(err);
        }
    }

function addfocus(e){
        let parent = e.target.parentNode.parentNode;
        parent.classList.add("focus")
}
    
    /*=== Remove focus ===*/
function remfocus(e){
        let parent = e.target.parentNode.parentNode
        if(e.target.value == ""){
            parent.classList.remove("focus")
        }
}

async function registerUser(e, userDetail){
    
}

    console.log(aadharData);
  return (
    // <div>
    //     <Container className="LgnForm mx-auto shadow bg-white pt-4 pb-6 mb-2 px-6">
    //   <Form>
    //     <Form.Group className="mb-3">
    //       <Form.Label className="text-gray-700 text-sm font-bold mb-2">Aadhar No.</Form.Label>
    //       <Form.Control
    //         onChange={aadharNumberHandler}
    //         required
    //         className="add-no-input shadow appearance-none border rounded w-100 py-3 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //         id="username"
    //         type="text"
    //         placeholder="Aadhar No."
    //         name="aNumber"
    //         value={aadharNumber.aNumber}
    //       />
    //     </Form.Group>
    //     {optGenerator ? <OtpForm VerifyOtp={VerifyOtp} /> : <ShowNext generateOtp={generateOtp} />}
        
    //   </Form>
    // </Container>
    // </div>
    <form action="" class="form__content">
                    <h1 class="form__title">Welcome</h1>

                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            {/* <i class='bx bx-user-circle'></i> */}
                            <i class='bx bx-envelope'></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Email</label>
                            <input 
                            onChange={changeHandler}
                            required
                            id="email"
                            type="email" 
                            name="email"
                            value={userDetail.email}
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                        
                    </div>

                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            <i class='bx bx-user-circle'></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Contact No.</label>
                            <input 
                            onChange={changeHandler}
                            required
                            id="contact"
                            type="text" 
                            name="contact"
                            value={userDetail.contact}
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                        
                    </div>

                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            <i class='bx bx-lock' ></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Password</label>
                            <input 
                            onChange={changeHandler}
                            required
                            id="password"
                            type="password" 
                            name="password"
                            value={userDetail.password}
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                        
                    </div>

                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            <i class='bx bx-lock' ></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Confirm Password</label>
                            <input 
                            onChange={changeHandler}
                            required
                            id="confirm_password"
                            type="password" 
                            name="confirm_password"
                            value={userDetail.confirm_password}
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                        
                    </div>

                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            <i style={{color : 'gray'}} class='bx bx-id-card'></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Aadhar No.</label>
                            <input 
                            onChange={aadharNumberHandler}
                            required
                            id="aNumber"
                            type="text" 
                            name="aNumber"
                            value={aadharNumber.aNumber}
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                        
                    </div>

                    {/* <div class="form__div">
                        <div class="form__icon">
                            <i class='bx bx-lock' ></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Password</label>
                            <input type="password" class="form__input" onFocus={addfocus} onBlur={remfocus} />
                        </div>
                    </div> */}

                    {optGenerator ? <OtpForm VerifyOtp={VerifyOtp} /> :  <ShowNext generateOtp={generateOtp} />}
                    {/* <input type="submit" class="form__button" value="Login" /> */}

                    {/* <div class="form__social">
                        <span class="form__social-text">Our login with</span>

                        <a href="#" class="form__social-icon"><i class='bx bxl-facebook' ></i></a>
                        <a href="#" class="form__social-icon"><i class='bx bxl-google' ></i></a>
                        <a href="#" class="form__social-icon"><i class='bx bxl-instagram' ></i></a>
                    </div> */}
    </form>
  )
}

export default Addhar