import React, { useState } from "react";
import ShowNext from "./ShowNext";
import OtpForm from "./OtpForm";
import axios from "axios";
import "./../UserSignup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Addhar = () => {
  const navigate = useNavigate();
  const [optGenerator, setOtpGenerator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState("");
  const [aadharNumber, setAadharNumber] = useState({ aNumber: "" });
  const [aadharData, setAadharData] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  const [userDetail, setUserDetail] = useState({
    contact: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const token = process.env.REACT_APP_SURPASS_TOKEN; // Keep secure, preferably use ENV

  function changeHandler(e) {
    setUserDetail({ ...userDetail, [e.target.name]: e.target.value });
  }

  function aadharNumberHandler(e) {
    setAadharNumber({ ...aadharNumber, [e.target.name]: e.target.value });
  }

  function addfocus(e) {
    e.target.closest(".form__div").classList.add("focus");
  }

  function remfocus(e) {
    if (e.target.value === "") {
      e.target.closest(".form__div").classList.remove("focus");
    }
  }

  const generateOtp = async (e) => {
    e.preventDefault();
    if (!aadharNumber.aNumber)
      return toast.error("Please enter Aadhaar number.");

    setLoading(true);
    try {
      const res = await axios.post(
        "https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp",
        { id_number: aadharNumber.aNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success("OTP sent to your registered mobile.");
        setOtpGenerator(true);
        setClientId(res.data.data.client_id);
        setResendTimer(59); // Start 59s timer
      } else {
        toast.error("Failed to generate OTP.");
      }
    } catch (err) {
      toast.error("Error while generating OTP.");
    } finally {
      setLoading(false);
    }
  };

  const VerifyOtp = async (e, userOtp) => {
    e.preventDefault();
    if (!userOtp) {
      return toast.error("Please enter OTP.");
    }
    if (userDetail.password !== userDetail.confirm_password) {
      return toast.error("Password and Confirm Password do not match.");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp",
        { client_id: clientId, otp: userOtp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setAadharData(res.data.data);
        const userSignupData = {
          userDetail,
          aadharData: res.data.data,
        };

        try {
          const signupRes = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/usersignup`,
            userSignupData
          );
          toast.success(
            signupRes.data.message || "User registered successfully"
          );
          navigate("/user_login");
        } catch (signupErr) {
          console.error("Signup error:", signupErr);
          toast.error(
            signupErr.response?.data?.Message || "User registration failed."
          );
        }
      } else {
        toast.error("OTP Verification failed.");
      }
    } catch (err) {
      //   console.error(err);
      toast.error("Something went wrong during verification.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  return (
    <form className="form__content">
      <h1 className="form__title">Welcome</h1>

      {["email", "contact", "password", "confirm_password"].map(
        (field, index) => (
          <div className="form__div form__div-one" key={index}>
            <div className="form__icon">
              <i
                className={`bx ${
                  field.includes("password")
                    ? "bx-lock"
                    : field === "email"
                    ? "bx-envelope"
                    : "bx-user-circle"
                }`}
              ></i>
            </div>
            <div className="form__div-input">
              <label className="form__label">
                {field.replace("_", " ").toUpperCase()}
              </label>
              <input
                onChange={changeHandler}
                onFocus={addfocus}
                onBlur={remfocus}
                required
                id={field}
                type={field.includes("password") ? "password" : "text"}
                name={field}
                value={userDetail[field]}
                className="form__input"
                disabled={loading}
              />
            </div>
          </div>
        )
      )}

      <div className="form__div form__div-one">
        <div className="form__icon">
          <i style={{ color: "gray" }} className="bx bx-id-card"></i>
        </div>
        <div className="form__div-input">
          <label className="form__label">Aadhar No.</label>
          <input
            onChange={aadharNumberHandler}
            onFocus={addfocus}
            onBlur={remfocus}
            required
            type="text"
            name="aNumber"
            value={aadharNumber.aNumber}
            className="form__input"
            disabled={loading}
          />
        </div>
      </div>

      {/* {loading && <p style={{ textAlign: "center", color: "gray" }}>Processing...</p>} */}

      {optGenerator ? (
        <OtpForm
          VerifyOtp={VerifyOtp}
          loading={loading}
          resendTimer={resendTimer}
          resendOtp={generateOtp}
        />
      ) : (
        <ShowNext generateOtp={generateOtp} loading={loading} />
      )}
    </form>
  );
};

export default Addhar;
