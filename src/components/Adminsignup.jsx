import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Adminsignup = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const navigate = useNavigate()
  const changeHandle = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };
  const submitHandle = async () => {
    console.log(signupData);
    if (signupData.password !== signupData.confirm_password) {
      return toast.error("password !== confirm password does not match");
    }
    try {
      const response = await axios.post(
        "http://localhost:9000/adminsignup",
        signupData
      );
      navigate("/login")
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response.data.Message);
    }
  };

  return (
    <div class="bg-grey-lighter min-h-screen flex flex-col">
      <div class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 class="mb-8 text-3xl text-center">Sign up</h1>
          <input
            type="text"
            class="block border border-grey-light w-full p-3 rounded mb-4"
            name="name"
            onChange={changeHandle}
            required
            value={signupData.name}
            placeholder="Full Name"
          />

          <input
            type="text"
            class="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            required
            onChange={changeHandle}
            value={signupData.email}
            placeholder="Email"
          />

          <input
            type="password"
            class="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            onChange={changeHandle}
            required
            value={signupData.password}
            placeholder="Password"
          />
          <input
            type="password"
            class="block border border-grey-light w-full p-3 rounded mb-4"
            name="confirm_password"
            onChange={changeHandle}
            value={signupData.confirm_password}
            required
            placeholder="Confirm Password"
          />
          {/* <select
            name="role"
            class="block border border-grey-light w-full p-3 rounded mb-4"
            onChange={changeHandle}
            value={signupData.role}
            required
          >
            <option value="Student">Student</option>
            <option value="Admin">Admin</option>
          </select> */}

          <button
            type="submit"
            onClick={submitHandle}
            class="w-full text-center py-3 rounded bg-blue-600 text-white hover:bg-green-dark focus:outline-none my-1"
          >
            Create Account
          </button>

          <div class="text-center text-sm text-grey-dark mt-4">
            By signing up, you agree to the
            <a
              class="no-underline border-b border-grey-dark text-grey-dark"
              href="#"
            >
              Terms of Service
            </a>{" "}
            and
            <a
              class="no-underline border-b border-grey-dark text-grey-dark"
              href="#"
            >
              Privacy Policy
            </a>
          </div>
        </div>

        <div class="text-grey-dark mt-6">
          Already have an account?
          <Link to="/login">
            <span class="no-underline border-b border-blue text-blue">
              Log in
            </span>
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Adminsignup;
