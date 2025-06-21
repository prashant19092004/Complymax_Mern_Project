import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import { FaCalendarAlt, FaRegEdit, FaPlaneDeparture } from "react-icons/fa";
import "./LeaveManagement.css";
import axios from "axios";
import { toast } from "react-toastify";

const LeaveManagement = () => {
  const [showModal, setShowModal] = useState(false);

  // Add state for form fields
  const [leaveType, setLeaveType] = useState("Casual");
  const [leaveSubType, setLeaveSubType] = useState("Full Day");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dateError, setDateError] = useState("");
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState();
  const [leaveHistory1, setLeaveHistory1] = useState();

  const leaveSummary = [
    { type: "Annual Leaves", used: 3, total: 12, color: "info" },
    { type: "Medical Leaves", used: 2, total: 5, color: "primary" },
    { type: "Casual Leaves", used: 1, total: 5, color: "danger" },
  ];

  const leaveHistory = [
    { from: "08 Jan, 19", to: "10 Jan, 19", status: "Approved" },
    { from: "10 Feb, 19", to: "12 Feb, 19", status: "Rejected" },
    { from: "08 May, 19", to: "08 May, 19", status: "Pending" },
    { from: "13 Jul, 19", to: "14 Jul, 19", status: "Pending" },
    { from: "02 Sep, 19", to: "02 Sep, 19", status: "Pending" },
    { from: "24 Nov, 19", to: "27 Nov, 19", status: "Pending" },
    { from: "02 Sep, 19", to: "02 Sep, 19", status: "Pending" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "danger";
      default:
        return "warning";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    return `${day} ${month}, ${year}`;
  };

  // Validate dates
  const validateDates = () => {
    setDateError("");
    
    if (!fromDate || !toDate) {
      return true; // Allow empty dates for now, will be validated on submit
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    // Check if from date is in the future
    if (fromDateObj < today) {
      setDateError("From date must be in the future");
      return false;
    }

    // Check if to date is not before from date
    if (toDateObj < fromDateObj) {
      setDateError("To date cannot be before from date");
      return false;
    }

    return true;
  };

  // Handle from date change
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    setDateError("");
    
    // If to date is set, validate the combination
    if (toDate) {
      const fromDateObj = new Date(e.target.value);
      const toDateObj = new Date(toDate);
      
      if (toDateObj < fromDateObj) {
        setToDate(""); // Clear to date if it's now invalid
      }
    }
  };

  // Handle to date change
  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    setDateError("");
  };

  // Handle leave request submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates before submission
    if (!validateDates()) {
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    const data = {
        establishment_id: userData.hired.establishment_id._id,
        supervisor_id: userData.hired.supervisor_id._id,
        client_id: userData.hired.hiring_id.client_id,
        reportingManager: userData.hired.supervisor_id.name,
        leaveType,
        reason,
        from: fromDate,
        to: toDate,
    }
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/leave-page/leave-application`, 
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if(response.data.success){
        setSuccess("Leave request submitted successfully!");
        toast.success("Leave request submitted successfully!");
        setShowModal(false);
        setFromDate("");
        setToDate("");
        setReason("");
        setLeaveType("Casual");
        setDateError("");
        console.log(response.data);
        setLeaveHistory1(response.data.leaveRequests);
      }
      // Optionally, refresh leave history here
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request leave");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/leave-page/user-data`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data.userData);
        setLeaveHistory1(response.data.leaveRequests);
        // console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching offer letters:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-4 leave-management">
      <h2 className="text-center mb-4 text-primary fw-bold display-6 title-shadow">Leave Request</h2>

      {/* Apply Leave Button */}
      <div className="text-end mb-3">
        <button className="btn btn-success rounded-pill px-4 py-2 shadow-sm apply-btn" onClick={() => setShowModal(true)}>
          <FaRegEdit className="me-2" /> Apply Leave
        </button>
      </div>

      {/* Leave Summary */}
      <div className="row mb-4">
          <div key="1" className="col-12 col-md-4 mb-3">
            <div className={`card text-white bg-danger h-100 shadow border-0 rounded-4 summary-card`}>
              <div className="card-body text-center">
                <h5 className="card-title text-white display-6 fw-bold">{userData && userData.casualLeave} / {userData && userData.hired?.establishment_id?.casualLeave}</h5>
                <p className="card-text text-white fs-5">Casual Leave</p>
              </div>
            </div>
          </div>
          <div key="2" className="col-12 col-md-4 mb-3">
            <div className={`card text-white bg-primary h-100 shadow border-0 rounded-4 summary-card`}>
              <div className="card-body text-center">
                <h5 className="card-title text-white display-6 fw-bold">{userData && userData.medicalLeave} / {userData && userData.hired?.establishment_id?.medicalLeave}</h5>
                <p className="card-text text-white fs-5">Medical Leave</p>
              </div>
            </div>
          </div>
          <div key="3" className="col-12 col-md-4 mb-3">
            <div className={`card text-white bg-info h-100 shadow border-0 rounded-4 summary-card`}>
              <div className="card-body text-center">
                <h5 className="card-title text-white display-6 fw-bold">{userData && userData.annualLeave} / {userData && userData.hired?.establishment_id?.annualLeave}</h5>
                <p className="card-text text-white fs-5">Earned Leave</p>
              </div>
            </div>
          </div>
      </div>

      {/* Leave History */}
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap">
          <h5 className="mb-2 mb-md-0 text-primary">Leave Request Info</h5>
          <select className="form-select w-auto border-primary custom-dropdown">
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="d-flex flex-column flex-md-row flex-wrap p-4 gap-3">
          {leaveHistory1 && leaveHistory1.map((leave, idx) => (
            <div key={idx} className="border rounded-4 p-3 flex-fill bg-light shadow-sm history-item">
              <div><strong>From:</strong> {formatDate(leave.from)} </div>
              <div><strong>To:</strong> {formatDate(leave.to)} </div>
              <div><strong>Status:</strong> <span className={`badge bg-${getStatusBadge(leave.status)}`}>{leave.status}</span></div>
            </div>
          ))}
        </div>
      </div>

      

      {/* Apply Leave Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="fw-bold text-primary fs-4">Apply for Leave</Modal.Title>
        </Modal.Header>
        <div className="modal-body-custom">
          <div className="bg-light rounded-4 p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Leave Type</Form.Label>
                <Form.Select
                  className="form-select custom-dropdown shadow-sm"
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value)}
                  required
                >
                  <option value="Casual">Casual</option>
                  <option value="Annual">Earned</option>
                  <option value="Medical">Medical</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Leave Subtype</Form.Label>
                <Form.Select
                  className="form-select custom-dropdown shadow-sm"
                  value={leaveSubType}
                  onChange={e => setLeaveSubType(e.target.value)}
                  required
                >
                  <option value="Casual">Full Day</option>
                  <option value="Annual">First Half</option>
                  <option value="Medical">Second Half</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Reason</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Family Function or Trip"
                  className="shadow-sm custom-input"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">From Date</Form.Label>
                <Form.Control
                  type="date"
                  className="shadow-sm custom-input"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">To Date</Form.Label>
                <Form.Control
                  type="date"
                  className="shadow-sm custom-input"
                  value={toDate}
                  onChange={handleToDateChange}
                  min={fromDate || new Date().toISOString().split('T')[0]} // Set minimum date to from date or today
                  required
                />
              </Form.Group>

              {dateError && <div className="alert alert-danger">{dateError}</div>}

              <div className="text-center">
                <Button
                  variant="primary"
                  className="w-100 d-flex justify-content-center align-items-center py-2 rounded-pill fw-bold submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <><FaPlaneDeparture className="me-2" /> Submit Leave Request</>
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeaveManagement;
