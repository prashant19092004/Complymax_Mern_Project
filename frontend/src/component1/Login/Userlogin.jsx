import React from 'react'
import '../Signup/UserSignup.css';
// import authenticationImg from '../../assets/authentication.svg';
import login_pic from '../../assets/login-pic.png';
import { Link } from "react-router-dom";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Userlogin = () => {

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
      });
    const [role, setRole] = useState('');

    const navigate = useNavigate();
    
    const changeHandle = (e) => {    
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        // console.log(loginData);
    };

    const establismentLogin = async (e) => {
      // console.log(loginData);
      // e.preventDefault();
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/adminlogin`,
          loginData
        )
        .then((res)=> {
          console.log(res.data);
          localStorage.setItem("token", res.data.token);
          navigate("/establisment_dashboard")
          toast.success(res.data.message);
        })
      } catch (err) {
        toast.error(err.response.data.message);
      }
    };

    const clientLogin = async (e) => {
      console.log(loginData);
      // e.preventDefault();
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/clientlogin`,
          loginData
        )
        .then((res)=> {
          console.log(res.data);
          localStorage.setItem("token", res.data.token);
          navigate("/client_dashboard")
          toast.success(res.data.message);
        })
      } catch (err) {
        toast.error(err.response.data.message);
      }
    };

    const supervisorLogin = async () => {
      // console.log(loginData);
      // e.preventDefault();
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/supervisorlogin`,
          loginData
        )
        .then((res)=> {
          console.log(res.data);
          localStorage.setItem("token", res.data.token);
          navigate("/supervisor_dashboard")
          toast.success(res.data.message);
        })
      } catch (err) {
        toast.error(err.response.data.message);
      }
    };


      const submitHandle = async () => {

        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/userlogin`,
            loginData
          )
          .then((res)=> {
            console.log(res);
            localStorage.setItem("token", res.data.token);
            navigate("/user_dashboard")
            toast.success(res.data.message);
          })
        } catch (err) {
          toast.error(err.response.data.message);
          // console.log(err.response);
          // console.log(err);
        }
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

let loginChangeHandle = (e) => {
  setRole(e.target.value);
}

let loginSubmitHandle = (e) => {
  e.preventDefault();
  if(role === 'User'){
    submitHandle();
  }
  else if(role === 'Supervisor'){
    supervisorLogin();
  }
  else if(role === 'Client'){
    clientLogin();
  }
  else if(role === 'Establisment'){
    establismentLogin();
  }
}


  return (
    <div class="l-form">
            <div class="shape1"></div>
            <div class="shape2"></div>

            <div class="form">
                {/* <img src={login_pic} alt="" class="form__img" /> */}

                <form action="" onSubmit={loginSubmitHandle} class="form__content">
                    <h1 class="form__title">Welcome</h1>

                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            <i class='bx bx-user-circle'></i>
                        </div>

                        <div class="form__div-input">
                            {/* <label for="" class="form__label">Role</label> */}
                            <select  
                            name='loginAs' 
                            onChange={loginChangeHandle} 
                            required 
                            value={role} 
                            id='role' 
                            class="form__input">
                            <option value="">Select</option>
                            <option value="User">Employee</option>
                            <option value="Supervisor">RM login</option>
                            <option value="Client">Customer</option>
                            <option value="Establisment">Company</option>
                            </select>
                        </div>
                    </div>

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
                            value={loginData.email} 
                            id='email' 
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                    </div>

                    <div class="form__div">
                        <div class="form__icon">
                            <i class='bx bx-lock' ></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Password</label>
                            <input type="password" name='password' onChange={changeHandle} required value={loginData.password} id='password' class="form__input" onFocus={addfocus} onBlur={remfocus}/>
                        </div>
                    </div>
                    
                    {
                      (role === 'Supervisor' || role === 'Client') ? '' : <Link to="/reset-password" className="form__forgot">Forgot Password?</Link>
                    }

                    <input type="submit" class="form__button" value="Login" />

                </form>
                <p class="form__register">
                    Don't have an account? <Link to="/user-signup" class="form__register-link">Sign up</Link>
                </p>
            </div>

        </div>
  )
}

export default Userlogin