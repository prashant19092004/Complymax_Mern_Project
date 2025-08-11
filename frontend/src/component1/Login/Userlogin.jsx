import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import "../Signup/UserSignup.css";
import { storeToken } from "../../utils/tokenService";
import "react-toastify/dist/ReactToastify.css";

const Userlogin = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "", app: false });
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => setRole(e.target.value);

  const addFocus = (e) => e.target.closest(".form__div").classList.add("focus");

  const removeFocus = (e) => {
    if (!e.target.value) {
      e.target.closest(".form__div").classList.remove("focus");
    }
  };

  const handleLoginRequest = async (url, redirectPath) => {
    console.log(`${process.env.REACT_APP_BACKEND_URL}${url}`);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}${url}`, loginData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(response.data);

      const token = response.data.token;
      await storeToken(token);
      toast.success(response.data.message);
      navigate(redirectPath);
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      toast.error(message);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    switch (role) {
      case "User":
        handleLoginRequest("/userlogin", "/user_dashboard");
        break;
      case "Supervisor":
        handleLoginRequest("/supervisorlogin", "/supervisor_dashboard");
        break;
      case "Client":
        handleLoginRequest("/clientlogin", "/client_dashboard");
        break;
      case "Establisment":
        handleLoginRequest("/adminlogin", "/establisment_dashboard");
        break;
      default:
        toast.error("Please select a role.");
    }
  };

  return (
    <>
      <div className="shape-box">
        <div className="shape1"></div>
        <div className="shape2"></div>
      </div>
      <div className="l-form">
        

        <div className="form">
          <form onSubmit={handleLoginSubmit} className="form__content">
            <h1 className="form__title">Welcome</h1>

            <div className="form__div form__div-one">
              <div className="form__icon">
                <i className="bx bx-user-circle"></i>
              </div>
              <div className="form__div-input">
                <select
                  name="loginAs"
                  onChange={handleRoleChange}
                  value={role}
                  required
                  className="form__input"
                >
                  <option value="">Select</option>
                  <option value="User">Employee</option>
                  <option value="Supervisor">RM login</option>
                  <option value="Client">Customer</option>
                  <option value="Establisment">Company</option>
                </select>
              </div>
            </div>

            <div className="form__div form__div-one">
              <div className="form__icon">
                <i className="bx bx-user-circle"></i>
              </div>
              <div className="form__div-input">
                <label className="form__label">Email</label>
                <input
                  type="email"
                  name="email"
                  onChange={handleInputChange}
                  value={loginData.email}
                  required
                  className="form__input"
                  onFocus={addFocus}
                  onBlur={removeFocus}
                />
              </div>
            </div>

            <div className="form__div">
              <div className="form__icon">
                <i className="bx bx-lock"></i>
              </div>
              <div className="form__div-input">
                <label className="form__label">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleInputChange}
                  value={loginData.password}
                  required
                  className="form__input"
                  onFocus={addFocus}
                  onBlur={removeFocus}
                />
              </div>
            </div>

            {role !== "Supervisor" && role !== "Client" && (
              <Link to="/reset-password" className="form__forgot">
                Forgot Password?
              </Link>
            )}

            <input type="submit" className="form__button" value="Login" />
          </form>

          <p className="form__register">
            Don't have an account?{" "}
            <Link to="/user-signup" className="form__register-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
    </>
  );
};

export default Userlogin;
