import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import './UserSignup.css';
import authenticationImg from './../../assets/authentication.svg';

const UserSignup = () => {
  return (
    <div>
        {/* <div className="container px-4 mx-auto my-8">
	            <Outlet />
        </div> */}
        <div class="l-form">
            {/* <div class="shape1"></div>
            <div class="shape2"></div> */}

            <div class="form">
                {/* <img src={authenticationImg} alt="" class="form__img" /> */}

                <Outlet />
                <p class="form__register">
                    Already have an account? <Link to="/user_login" class="form__register-link">Login</Link>
                </p>
            </div>

        </div>
    </div>
  )
}

export default UserSignup