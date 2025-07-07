import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientForm.css';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const ClientForm = () => {

    const token = localStorage.getItem("token");
    const [clientRegisterData, setClientRegisterData] = useState({
        name : "",
        contact : "",
        email: "",
        password: "",
        state : "",
        location : ""
    });
    let states_of_india = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal"
    ]
    const navigate = useNavigate();
    
    const changeHandle = (e) => {
        
        setClientRegisterData({ ...clientRegisterData, [e.target.name]: e.target.value });
        // console.log(loginData);
    };

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

    let register = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/establishment/client_register`,
                clientRegisterData,
                {
                    headers: {
                      Authorization : `Bearer ${token}`
                    }
                }
            )
            .then((res) => {
                console.log(res);
                toast.success(res.data.message);
                setClientRegisterData({
                    name : "",
                    contact : "",
                    email: "",
                    password: "",
                    state : "",
                    location : ""
                });
            })
        }catch(err){
            console.log("try again");
        }
    }


  return (
    <div className='client_form'>
        <div class="form">
                {/* <img src={login_pic} alt="" class="form__img" /> */}

                <form action="" class="form__content d-flex flex-column">
                    <h1 class="form__title">Client Registration</h1>
                    <div className='client_forms_box d-flex flex-wrap'>
                        <div class="form__div form__div-one">
                            <div class="form__icon">
                                <i class='bx bx-user-circle'></i>
                            </div>

                            <div class="form__div-input">
                                <label for="name" class="form__label">Name</label>
                                <input 
                                type="text" 
                                name='name' 
                                onChange={changeHandle} 
                                required 
                                value={clientRegisterData.name} 
                                id='name' 
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
                            type="text" 
                            name='contact' 
                            onChange={changeHandle} 
                            required 
                            value={clientRegisterData.contact} 
                            id='contact' 
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                        </div>
                    </div>
                    
                    <div className='client_forms_box d-flex flex-wrap'>
                        <div class="form__div form__div-one">
                            <div class="form__icon">
                                <i class='bx bx-user-circle'></i>
                            </div>

                            <div class="form__div-input">
                                <label for="" class="form__label">Email</label>
                                <input 
                                type="email" 
                                name='email' 
                                onChange={changeHandle} 
                                required 
                                value={clientRegisterData.email} 
                                id='email' 
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
                            <input type="password" name='password' onChange={changeHandle} required value={clientRegisterData.password} id='password' class="form__input" onFocus={addfocus} onBlur={remfocus}/>
                        </div>
                        </div>
                    </div>

                    <div className='client_forms_box d-flex flex-wrap'>
                        <div class="form__div form__div-one">
                            <div class="form__icon">
                                <i class='bx bx-user-circle'></i>
                            </div>

                            <div class="form__div-input">
                                <label for="state" class="form__label"></label>
                                <select onChange={changeHandle} name="state" id="state" class="form__input" placeholder="" value={clientRegisterData.state} required="">
                                    <option value="">Select State</option>
                                    {
                                        states_of_india.map((state) => {
                                            return(
                                                <option key={state} value={state}>{state}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div class="form__div form__div-one">
                            <div class="form__icon">
                                <i class='bx bx-lock' ></i>
                            </div>

                            <div class="form__div-input">
                                <label for="" class="form__label">Location</label>
                                <input type="text" name='location' onChange={changeHandle} required value={clientRegisterData.location} id='location' class="form__input" onFocus={addfocus} onBlur={remfocus}/>
                            </div>
                        </div>
                    </div>
                    {/* <a href="#" class="form__forgot">Forgot Password?</a> */}

                    <input type="submit" onClick={register} class="form__button" value="Register" />

                </form>
            </div>
    </div>
  )
}

export default ClientForm