import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import defaultProfile from "../../../assets/Default_pfp.svg.png";
import close from "../../../assets/close.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import { Parser } from "json2csv";
import Papa from "papaparse";
import { FaDownload } from "react-icons/fa";

const AllCandidates = () => {
  const [allCandidatesList, setAllCandidatesList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const buttonStyle = {
    backgroundColor: "green",
    color: "white",
    height: "30px", // Adjust the height as needed
    padding: "0 15px", // Adjust padding for a more compact look
    fontSize: "14px", // Adjust font size if needed
    borderRadius: "5px", // Optional: Adjust border radius
  };

  const downloadCSV = () => {
    const selectedFields = filteredList.map((employee) => ({
      EmployeeId: employee.employeeId ?? "NAN",
      name: employee.full_Name ?? "NAN",
      Father_Name: employee.care_of ?? "NAN",
      Contact: employee.contact ?? "NAN",
      Address: `${employee.house ?? "NAN"}, ${employee.street ?? "NAN"}, ${
        employee.landmark ?? "NAN"
      }, ${employee.loc ?? "NAN"}, ${employee.subdist ?? "NAN"}, ${
        employee.dist ?? "NAN"
      }, ${employee.state ?? "NAN"} - ${employee.zip ?? "NAN"}`,
      pan_name: employee.pan_name ?? "NAN",
      pan_number: employee.pan_number ?? "NAN",
      aadharNumber: employee.aadhar_number ?? "NAN",
      account_name: employee.account_name ?? "NAN",
      account_number: `'${employee.account_number ?? "NAN"}`,
      Ifsc: employee.account_ifsc ?? "NAN",
    }));

    // Convert the employee data to CSV format
    const csv = Papa.unparse(selectedFields);

    // Create a downloadable link for the CSV file
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee_list.csv"; // Name of the CSV file
    a.click(); // Trigger the download
  };

  const fetchingCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/establishment/all-candidates`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setAllCandidatesList(res.data.users);
          setFilteredList(res.data.users);
          setLoading(false);
        });
    } catch (e) {
      toast.error("error in fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingCandidates();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  let changeHandle = (e) => {
    console.log(e.target.value);
    let query = e.target.value.toLowerCase();

    const filteredData =
      allCandidatesList && allCandidatesList.length
        ? allCandidatesList.filter(
            (hired) => hired.full_Name.toLowerCase().indexOf(query) > -1
          )
        : [];
    setFilteredList(filteredData);
    // setShowDropDown(true);
  };

  function toggleShow() {
    var el = document.getElementById("box");
    el.classList.toggle("show");
  }

  let openEnquiry = () => {
    const enquiry_pop_up = document.querySelector(".enquiry-section");
    enquiry_pop_up.style.scale = 1;
  };

  let closeEnquiry = () => {
    const enquiry_pop_up = document.querySelector(".enquiry-section");
    enquiry_pop_up.style.scale = 0;
  };

  return (
    <div className="supervisor_hire position-relative w-full">
      <div className="w-full d-flex justify-content-center mt-5">
        <h1 className="fs-2 text-center" style={{ color: "green" }}>
          All Candidates
        </h1>
      </div>
      <div
        className="ragister_div"
        style={{ paddingTop: "0px", alignItems: "center", cursor: "pointer" }}
      >
        <div className="search_container mb-5">
          <input
            type="text"
            id="box"
            placeholder="Search...."
            class="search__box"
            onChange={changeHandle}
          />
          <i
            class="fas fa-search search__icon"
            id="icon"
            onClick={toggleShow}
          ></i>
        </div>
        <FaDownload onClick={downloadCSV} />
        {/* <Button className='mt-2' onClick={postHiringButtonHandler} varient='primary'>Post Hiring</Button> */}
      </div>
      <div>
        <ul className="list_box px-5" style={{ padding: "0px" }}>
          {filteredList?.map((user) => {
            return (
              <li className="list">
                <img className="" src={defaultProfile} alt="" />
                <div className="w-full">
                  <div
                    className="list_content w-full"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div>{user.employeeId}.</div>
                    <div className="list-left">
                      <p>{user.full_Name}</p>
                    </div>
                    <div className="list-middle">
                      <p>{user.contact}</p>
                    </div>
                    <div className="list-right">
                      <button
                        class="btn custom-btn"
                        onClick={() => {
                          navigate("/establisment_dashboard/employee-detail", {
                            state: { employeeId: user._id },
                          });
                        }}
                        style={buttonStyle}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <p>Addhar No. : {user.aadhar_number}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AllCandidates;
