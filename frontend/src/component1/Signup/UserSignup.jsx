import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./UserSignup.css";
import authenticationImg from "./../../assets/authentication.svg";
import { isNativeApp } from "../../utils/isNativeApp";

const UserSignup = () => {
  return (
    <div>
      <div className="shape-box">
        <div className="shape1"></div>
        <div className="shape2"></div>
      </div>
      <div className="l-form">
        <div className="form">
          <Outlet />
          <p className="form__register">
            Already have an account?{" "}
            <Link to={isNativeApp ? "/app-login" : "/user_login"} className="form__register-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
