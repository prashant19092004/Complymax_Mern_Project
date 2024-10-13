import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SuperAdminLogin = () => {

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const changeHandle = (e) => {    
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        // console.log(loginData);
    };

    const superadminLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/superadmin-login`,
          loginData
        )
        .then((res)=> {
          console.log(res.data);
          localStorage.setItem("token", res.data.token);
          navigate("/superadmin-dashboard");
          toast.success(res.data.message);
        })
      } catch (err) {
        // console.log(err);
        toast.error(err.response.data.message);
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

  return (
    <div>
        <div class="l-form">
            <div class="shape1"></div>
            <div class="shape2"></div>

            <div class="form">
                {/* <img src={login_pic} alt="" class="form__img" /> */}

                <form action="" onSubmit={superadminLogin} class="form__content">
                    <h1 class="form__title">Welcome</h1>

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
                    
                    {/* {
                      (role === 'Supervisor' || role === 'Client') ? '' : <Link to="/reset-password" className="form__forgot">Forgot Password?</Link>
                    } */}

                    <input type="submit" class="form__button" value="Login" />

                </form>
            </div>
        </div>
    </div>
  )
}

export default SuperAdminLogin;