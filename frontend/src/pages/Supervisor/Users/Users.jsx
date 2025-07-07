import axios from "axios";
import React, { useEffect, useState } from "react";
import defaultProfile from "../../../assets/Default_pfp.svg.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaIdCard, FaUser, FaPhone, FaAddressCard } from "react-icons/fa";

const Users = () => {
  const [usersList, setUsersList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const buttonStyle = {
    backgroundColor: "green",
    color: "white",
    height: "30px",
    padding: "0 15px",
    fontSize: "14px",
    borderRadius: "5px",
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/supervisor/users`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsersList(response.data.users);
      setFilteredList(response.data.users);
      setLoading(false);
    } catch (e) {
      toast.error(e.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredData = usersList && usersList.length
      ? usersList.filter((user) => 
          user.full_Name.toLowerCase().includes(query) || 
          user.aadhar_number.toLowerCase().includes(query)
        )
      : [];
    setFilteredList(filteredData);
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      <div className="row mb-3 mb-md-4">
        <div className="col-12">
          <h1 className="text-center text-primary fw-bold mb-0">All Users</h1>
        </div>
      </div>

      <div className="row mb-3 mb-md-4">
        <div className="col-12 col-md-6 mx-auto">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by name or Aadhar number..."
              onChange={handleSearch}
              style={{ boxShadow: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="d-none d-md-block">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">Profile</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Aadhar Number</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredList?.map((user, index) => (
                        <tr key={index} className="align-middle">
                          <td className="text-center">
                            <img
                              src={defaultProfile}
                              alt="Profile"
                              className="rounded-circle"
                              style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            />
                          </td>
                          <td className="fw-medium">{user.full_Name}</td>
                          <td>{user.contact}</td>
                          <td>{user.aadhar_number}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => navigate("/supervisor_dashboard/employee-detail", { state: { employeeId: user._id } })}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredList.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div className="text-muted">No users found</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="d-block d-md-none">
        <div className="row g-3">
          {filteredList?.map((user, index) => (
            <div key={index} className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={defaultProfile}
                      alt="Profile"
                      className="rounded-circle me-3"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                    <div>
                      <h6 className="mb-1 fw-bold">{user.full_Name}</h6>
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="d-flex align-items-center text-muted">
                        <FaPhone className="me-2" />
                        <small>{user.contact}</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center text-muted">
                        <FaAddressCard className="me-2" />
                        <small>{user.aadhar_number}</small>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => navigate("/supervisor_dashboard/employee-detail", { state: { userId: user._id } })}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredList.length === 0 && (
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body text-center py-4">
                  <div className="text-muted">No users found</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;