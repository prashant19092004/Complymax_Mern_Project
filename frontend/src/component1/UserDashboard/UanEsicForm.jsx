import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../../utils/tokenService";

const UanEsicForm = () => {
  const navigate = useNavigate();
  const [uanNumber, setUanNumber] = useState("");
  const [esicNumber, setEsicNumber] = useState("");
  //   const [otpGenerated, setOtpGenerated] = useState(false);
  //   const [panData, setPanData] = useState();

  function uanChangeHandler(e) {
    setUanNumber(e.target.value);
  }

  function esicChangeHandler(e) {
    setEsicNumber(e.target.value);
  }

  async function addUanEsic(e) {
    e.preventDefault();
    const uanData = {
      uanNumber: uanNumber,
      esicNumber: esicNumber,
    };
    const userToken = await getToken();

    try {
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/profile/add_uan_esic`,
          uanData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          // console.log(res);
          if (res.data.success) {
            navigate("/user_dashboard/user_profile");
            toast.success(res.data.message);
          } else {
            toast.error(res.data.message);
          }
        });
    } catch (err) {
      toast.error("Try Again..");
    }
  }

  return (
    <div className="pan_form">
      <div className="form-box">
        <h1 className="mb-3">Add Pan Card</h1>
        {/* <p>Using <a href="https://getbootstrap.com">Bootstrap</a> and <a href="https://www.formbucket.com">FormBucket</a></p> */}
        <form action="#">
          <div className="form-group">
            <label for="uan_number">UAN Number</label>
            <input
              className="form-control"
              onChange={uanChangeHandler}
              id="panNumber"
              type="text"
              name="panNumber"
            />
          </div>
          <div className="form-group">
            <label for="efic_number">EFIC Number</label>
            <input
              className="form-control"
              id="panNumber"
              type="text"
              onChange={esicChangeHandler}
              name="panNumber"
            />
          </div>
          {/* <div className="form-group mt-3" id='otp_box' style={{ display : `${otpGenerated ? 'block' : 'none'}`}}>
                  <label for="pan_number">OTP</label>
                  <input className="form-control" maxLength="6" id="panNumber" type="text" name="panNumber" onChange={changeHandler} />
                </div> */}
          <div className="d-flex gap-3 mt-4">
            <input
              className="btn btn-primary"
              onClick={addUanEsic}
              type="submit"
              value="Add"
            />
            <button className="btn btn-danger" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UanEsicForm;
