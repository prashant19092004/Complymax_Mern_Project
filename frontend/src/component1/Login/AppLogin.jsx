import React from "react";
import "../Signup/UserSignup.css";
// import authenticationImg from '../../assets/authentication.svg';
import login_pic from "../../assets/login-pic.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storeToken } from "../../utils/tokenService"; // Assuming you have a utility function to store the token

const AppLogin = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    app: true
  });

  const navigate = useNavigate();

  const changeHandle = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    // console.log(loginData);
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    try {
      // Debug: log the backend URL and loginData
      console.log(
        "Calling API:",
        `${process.env.REACT_APP_BACKEND_URL}/userlogin`
      );
      console.log("Login Data:", loginData);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/userlogin`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          // withCredentials: true, // <-- Add this if needed
        }
      );

      console.log("Login Response:", response);

      // localStorage.setItem("token", response.data.token);
      toast.success(response.data.message);
      await storeToken(response.data.token);
      navigate("/user_dashboard");
    } catch (err) {
      console.error("Login Error:", err);

      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else if (err.message) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  function addfocus(e) {
    let parent = e.target.parentNode.parentNode;
    parent.classList.add("focus");
  }

  /*=== Remove focus ===*/
  function remfocus(e) {
    let parent = e.target.parentNode.parentNode;
    if (e.target.value == "") {
      parent.classList.remove("focus");
    }
  }

  return (
    <>
      <div className="shape-box">
        <div className="shape1"></div>
        <div className="shape2"></div>
      </div>
      <div class="l-form">
        <div class="shape1"></div>
        <div class="shape2"></div>

        <div class="form">
          {/* <img src={login_pic} alt="" class="form__img" /> */}

          <form action="" onSubmit={submitHandle} class="form__content">
            <h1 class="form__title">Welcome</h1>

            <div class="form__div form__div-one">
              <div class="form__icon">
                <i class="bx bx-user-circle"></i>
              </div>

              <div class="form__div-input">
                <label for="" class="form__label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={changeHandle}
                  required
                  value={loginData.email}
                  id="email"
                  class="form__input"
                  onFocus={addfocus}
                  onBlur={remfocus}
                />
              </div>
            </div>

            <div class="form__div">
              <div class="form__icon">
                <i class="bx bx-lock"></i>
              </div>

              <div class="form__div-input">
                <label for="" class="form__label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={changeHandle}
                  required
                  value={loginData.password}
                  id="password"
                  class="form__input"
                  onFocus={addfocus}
                  onBlur={remfocus}
                />
              </div>
            </div>

            <Link to="/reset-password" className="form__forgot">
              Forgot Password?
            </Link>

            <input type="submit" class="form__button" value="Login" />
          </form>

          <p class="form__register">
            Don't have an account?{" "}
            <Link to="/user-signup" class="form__register-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AppLogin;
