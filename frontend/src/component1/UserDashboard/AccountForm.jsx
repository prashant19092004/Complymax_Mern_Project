import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AccountForm = () => {
  const navigate = useNavigate();
  const [panNumber, setPanNumber] = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [accountNumber, setAccountNumber] = useState({
    id_number: "",
    ifsc: "",
    ifsc_details: true
  });
  const [accountData, setAccountData] = useState();
  const userToken = localStorage.getItem("token");

  function changeHandler(e) {
    setAccountNumber({
      ...accountNumber, [e.target.name]: e.target.value
    });
  }

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/user_dashboard/user_profile');
  };

  async function generateAccount(e) {
    e.preventDefault();
    try {
      await axios.post(
        "https://kyc-api.surepass.io/api/v1/bank-verification/",
        accountNumber,
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_SURPASS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      )
        .then(async (res) => {
          if (res.data.success) {
            setAccountData(res.data.data);

            const addAccountData = {
              account_number: accountNumber.id_number,
              data: res.data.data
            }
            try {
              await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/user/profile/add_Account`,
                addAccountData,
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`
                  }
                }
              )
                .then((res) => {
                  if (res.data.success) {
                    navigate("/user_dashboard/user_profile");
                    toast.success(res.data.message);
                  }
                  else {
                    toast.error(res.data.message);
                  }
                })
            } catch (err) {
              toast.error('Try Again..')
            }
          }
        })
    } catch (err) {
      toast.error('Try Again..')
    }
  }

  return (
    <div className='pan_form'>
      <div className="form-box">
        <h1 className='mb-3'>Add Bank Account</h1>
        {/* <p>Using <a href="https://getbootstrap.com">Bootstrap</a> and <a href="https://www.formbucket.com">FormBucket</a></p> */}
        <form>
          <div className="form-group">
            <label htmlFor="account_number">Account Number</label>
            <input
              className="form-control"
              id="id_number"
              type="text"
              name="id_number"
              onChange={changeHandler}
            />
          </div>
          <div className="form-group mt-3" id='otp_box'>
            <label htmlFor="ifsc">IFSC Code</label>
            <input
              className="form-control"
              id="ifsc"
              type="text"
              name="ifsc"
              onChange={changeHandler}
            />
          </div>
          <div className='d-flex gap-3 mt-4'>
            <input
              className="btn btn-primary"
              onClick={generateAccount}
              type="submit"
              value={otpGenerated ? 'Verify' : 'Add'}
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;