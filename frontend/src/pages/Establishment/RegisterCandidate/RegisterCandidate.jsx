import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import defaultProfile from "../../../assets/Default_pfp.svg.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import close from "../../../assets/close.png";

const RegisterCandidate = () => {
  const [usersList, setUsersList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panNumber, setPanNumber] = useState("");
  const [panVerified, setPanVerified] = useState(false);
  const [panData, setPanData] = useState();
  const [panLoading, setPanLoading] = useState(false);
  const enquiryRef = useRef();
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("token");

  const [registerData, setRegisterData] = useState({
    fullName: "",
    fatherName: "",
    dob: "",
    email: "",
    aadhar_no: "",
    contact: "",
    pan_number: "",
  });

  const buttonStyle = {
    backgroundColor: "green",
    color: "white",
    height: "30px",
    padding: "0 15px",
    fontSize: "14px",
    borderRadius: "5px",
  };

  const fetchingHired = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/users`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      

      const sortedUsers = response.data.users.sort((a, b) =>
      getTimestampFromObjectId(b._id) - getTimestampFromObjectId(a._id)
    );

      setUsersList(sortedUsers);
      setFilteredList(sortedUsers);
      setLoading(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingHired();
  }, []);

  const verifyPan = async () => {
    try {
      setPanLoading(true);
      const res = await axios.post(
        "https://kyc-api.surepass.io/api/v1/pan/pan-comprehensive",
        { id_number: panNumber },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_SURPASS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        setPanVerified(true);
        setPanData(res.data.data);
        setRegisterData((prev) => ({
          ...prev,
          fullName: res.data.data.full_name,
          dob: res.data.data.dob,
          email: res.data.data.email,
          pan_number: res.data.data.pan_number,
          contact: res.data.data.phone_number,
        }));
        toast.success("PAN Verified");
      }
    } catch (err) {
      toast.error("PAN Verification Failed");
    } finally {
      setPanLoading(false);
    }
  };

  const registerUser = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/register-user`,
        { registerData, panData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      toast.success("Candidate Registered");
      closeEnquiry();

      const sorted = res.data.users.sort((a, b) =>
    getTimestampFromObjectId(b._id) - getTimestampFromObjectId(a._id)
  );
      setUsersList(sorted);
      setFilteredList(sorted);
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  const panChangeHandler = (e) => setPanNumber(e.target.value);

  const userDataChangeHandler = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  function getTimestampFromObjectId(objectId) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
}

  const changeHandle = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredData = usersList.filter((user) =>
      user.full_Name.toLowerCase().includes(query)
    );
    setFilteredList(filteredData);
  };

  const openEnquiry = () => {
    enquiryRef.current.style.scale = 1;
  };

  const closeEnquiry = () => {
    enquiryRef.current.style.scale = 0;
    setPanData();
    setPanVerified(false);
    setPanNumber("");
    setRegisterData({
      fullName: "",
      fatherName: "",
      dob: "",
      email: "",
      aadhar_no: "",
      contact: "",
      pan_number: "",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="supervisor_hire position-relative w-full">
      <div className="w-full d-flex justify-content-center mt-5">
        <h1 className="fs-2 text-center" style={{ color: "green" }}>
          Candidate Registration
        </h1>
      </div>

      <div className="ragister_div" style={{ paddingTop: "0px" }}>
        <div className="search_container mb-5">
          <input
            type="text"
            id="box"
            placeholder="Search..."
            className="search__box"
            onChange={changeHandle}
          />
          <i className="fas fa-search search__icon" id="icon"></i>
        </div>
        <Button
          className="mt-2"
          onClick={openEnquiry}
          style={{ height: "50px" }}
          variant="primary"
        >
          Register New
        </Button>
      </div>

      <ul className="list_box px-5" style={{ padding: "0px", marginBottom: "100px" }}>
        {filteredList.map((user) => (
          <li className="list" key={user._id}>
            <img src={defaultProfile} alt="" />
            <div className="w-full">
              <div
                className="list_content w-full"
                style={{ justifyContent: "space-between" }}
              >
                <div className="list-left">
                  <p>{user.full_Name}</p>
                </div>
                <div className="list-middle">
                  <p>{user.contact}</p>
                </div>
                <div className="list-right">
                  <button
                    className="btn custom-btn"
                    onClick={() =>
                      navigate("/establisment_dashboard/employee-detail", {
                        state: { employeeId: user._id },
                      })
                    }
                    style={buttonStyle}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section ref={enquiryRef} className="enquiry-section">
        <div className="enquiry-form">
          <img
            onClick={closeEnquiry}
            className="enquiry-close"
            src={close}
            alt=""
          />
          <h2>Register</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerUser();
            }}
          >
            <div className="input-box w-full">
              <div className="input-div w-full">
                <label className="form-label" htmlFor="pan_number">
                  PAN Number
                </label>
                <input
                  required
                  type="text"
                  onChange={panChangeHandler}
                  name="pan_number"
                  id="pan_number"
                  disabled={panVerified}
                  placeholder="PAN Number..."
                />
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <p
                onClick={() => {
                  if (!panVerified && !panLoading) verifyPan();
                }}
                style={{
                  color: panVerified ? "gray" : "green",
                  cursor: panVerified ? "default" : "pointer",
                }}
              >
                {panVerified
                  ? "Verified"
                  : panLoading
                  ? "Verifying..."
                  : "Verify"}
              </p>
            </div>

            {panVerified && (
              <>
                <div className="input-box w-full">
                  <div className="input-div w-full">
                    <label className="form-label" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={registerData.fullName}
                      onChange={userDataChangeHandler}
                      name="fullName"
                      id="fullName"
                      disabled
                    />
                  </div>
                </div>

                <div className="input-box w-full">
                  <div className="input-div w-full">
                    <label className="form-label" htmlFor="fatherName">
                      Father Name
                    </label>
                    <input
                      required
                      type="text"
                      value={registerData.fatherName}
                      onChange={userDataChangeHandler}
                      name="fatherName"
                      id="fatherName"
                      placeholder="Father Name"
                    />
                  </div>
                </div>

                <div className="input-box w-full">
                  <div className="input-div w-full">
                    <label className="form-label" htmlFor="dob">
                      DOB
                    </label>
                    <input
                      required
                      type="date"
                      value={registerData.dob}
                      onChange={userDataChangeHandler}
                      name="dob"
                      id="dob"
                      disabled
                    />
                  </div>
                </div>

                <div className="input-box w-full">
                  <div className="input-div w-full">
                    <label className="form-label" htmlFor="aadhar_no">
                      Aadhar Number
                    </label>
                    <input
                      required
                      type="text"
                      value={registerData.aadhar_no}
                      onChange={userDataChangeHandler}
                      name="aadhar_no"
                      id="aadhar_no"
                      placeholder="Aadhar No."
                    />
                  </div>
                </div>

                <div className="input-box w-full">
                  <div className="input-div w-full">
                    <label className="form-label" htmlFor="contact">
                      Mobile No.
                    </label>
                    <input
                      required
                      type="text"
                      value={registerData.contact}
                      onChange={userDataChangeHandler}
                      name="contact"
                      id="contact"
                      placeholder="Mobile No."
                    />
                  </div>
                </div>

                <div className="input-box w-full">
                  <div className="input-div w-full">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={registerData.email}
                      onChange={userDataChangeHandler}
                      name="email"
                      id="email"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <button className="enquiry-button" type="submit">
                    Save
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default RegisterCandidate;
