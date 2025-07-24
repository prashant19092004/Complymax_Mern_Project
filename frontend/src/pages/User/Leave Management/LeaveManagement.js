import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import { FaCalendarAlt, FaRegEdit, FaPlaneDeparture } from "react-icons/fa";
import "./LeaveManagement.css";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/tokenService";

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
  const [userData, setUserData] = useState();
  const [leaveHistory1, setLeaveHistory1] = useState();

  const leaveSummary = [
    { type: "Earned Leaves", used: 3, total: 12, color: "info" },
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

  const getLeaveDuration = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diff = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
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
      leaveSubType,
      reason,
      from: fromDate,
      to: toDate,
    };

    const token = await getToken();
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/leave-page/leave-application`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        setSuccess("Leave request submitted successfully!");
        toast.success("Leave request submitted successfully!");
        setShowModal(false);
        setFromDate("");
        setToDate("");
        setReason("");
        setLeaveType("Casual");
        setLeaveSubType("Full Day");
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
      const token = await getToken();
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/leave-page/user-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.userData);
        setLeaveHistory1(response.data.leaveRequests);
        // console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching offer letters:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
      <h2 className="text-center mb-4 text-primary fw-bold display-6 title-shadow">
        Leave Request
      </h2>

      {/* Apply Leave Button */}
      <div className="text-end mb-3">
        <button
          className="btn btn-success rounded-pill px-4 py-2 shadow-sm apply-btn"
          onClick={() => setShowModal(true)}
        >
          <FaRegEdit className="me-2" /> Apply Leave
        </button>
      </div>

      {/* Leave Summary */}
      <div className="row mb-4">
        <div key="1" className="col-12 col-md-4 mb-3">
          <div
            className={`card text-white bg-danger h-100 shadow border-0 rounded-4 summary-card`}
          >
            <div className="card-body text-center">
              <h5 className="card-title text-white display-6 fw-bold">
                {userData && userData.casualLeave} /{" "}
                {userData && userData.hired?.establishment_id?.casualLeave}
              </h5>
              <p className="card-text text-white fs-5">Casual Leave</p>
            </div>
          </div>
        </div>
        <div key="2" className="col-12 col-md-4 mb-3">
          <div
            className={`card text-white bg-primary h-100 shadow border-0 rounded-4 summary-card`}
          >
            <div className="card-body text-center">
              <h5 className="card-title text-white display-6 fw-bold">
                {userData && userData.medicalLeave} /{" "}
                {userData && userData.hired?.establishment_id?.medicalLeave}
              </h5>
              <p className="card-text text-white fs-5">Medical Leave</p>
            </div>
          </div>
        </div>
        <div key="3" className="col-12 col-md-4 mb-3">
          <div
            className={`card text-white bg-info h-100 shadow border-0 rounded-4 summary-card`}
          >
            <div className="card-body text-center">
              <h5 className="card-title text-white display-6 fw-bold">
                {userData && userData.earnedLeave} /{" "}
                {userData && userData.hired?.establishment_id?.earnedLeave}
              </h5>
              <p className="card-text text-white fs-5">Earned Leave</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leave History */}
      {/* Leave Requests in Expandable List Format */}
      <div className="request-list-flex">
        <div className="request-list-header">
          <div></div>
          <div>Name</div>
          <div>Leave Type</div>
          <div>Duration</div>
          <div>Status</div>
        </div>
        {leaveHistory1 && leaveHistory1.length > 0 ? (
          leaveHistory1.map((req, idx) => (
            <div key={idx}>
              <div
                className="request-list-row"
                onClick={() =>
                  setLeaveHistory1((prev) =>
                    prev.map((item, i) => ({
                      ...item,
                      expanded: i === idx ? !item.expanded : false,
                    }))
                  )
                }
              >
                <div data-label="Photo">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userData?.full_Name || "You"
                    )}&background=${
                      ["007bff", "28a745", "fd7e14"][idx % 3]
                    }&color=fff`}
                    alt="avatar"
                    className="avatar"
                  />
                </div>
                <div data-label="Name">{userData?.full_Name || "You"}</div>
                <div data-label="Leave Type">{req.leaveType}</div>
                <div data-label="Duration">
                  {getLeaveDuration(req.from, req.to)} days
                </div>
                <div data-label="Status">
                  <span className={`status-badge ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </div>
              </div>

              {req.expanded && (
                <div className="expanded-details-modern">
                  <div className="expanded-grid">
                    <div>
                      <div className="label">Reason</div>
                      <div className="value">{req.reason}</div>
                    </div>
                    <div>
                      <div className="label">From</div>
                      <div className="value">{formatDate(req.from)}</div>
                    </div>
                    <div>
                      <div className="label">To</div>
                      <div className="value">{formatDate(req.to)}</div>
                    </div>
                    <div>
                      <div className="label">Reporting Manager</div>
                      <div className="value">
                        {userData.hired?.supervisor_id?.name}
                      </div>
                    </div>
                    <div>
                      <div className="label">Leave Type</div>
                      <div className="value">{req.leaveType}</div>
                    </div>
                    <div>
                      <div className="label">Leave Subtype</div>
                      <div className="value">{req.leaveSubType}</div>
                    </div>
                    {req.status == "Approved" && (
                      <div>
                        <div className="label">Accepted By {req.respondedByEstablishment ? 'Establishment' : 'Supervisor'}</div>
                        <div className="value">{req.respondedByEstablishment ? req.respondedByEstablishment?.name : req.respondedBySupervisor?.name}</div>
                      </div>
                    )}
                    <div>
                      <div className="label">Status</div>
                      <span
                        className={`status-badge ${req.status.toLowerCase()}`}
                      >
                        {req.status}
                      </span>
                    </div>
                    {req.status === "Rejected" && (
                      <div>
                        <div className="label">Rejected By</div>
                        <div className="value">
                          {req.respondedByEstablishment
                            ? "Rejected by HOD"
                            : "Rejected by RM"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">No leave requests found.</div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="fw-bold text-primary fs-4">
            Apply for Leave
          </Modal.Title>
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
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                >
                  <option value="Casual">Casual</option>
                  <option value="Earned">Earned</option>
                  <option value="Medical">Medical</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Leave Subtype</Form.Label>
                <Form.Select
                  className="form-select custom-dropdown shadow-sm"
                  value={leaveSubType}
                  onChange={(e) => setLeaveSubType(e.target.value)}
                  required
                >
                  <option value="Full Day">Full Day</option>
                  <option value="First Half">First Half</option>
                  <option value="Second Half">Second Half</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Reason</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Family Function or Trip"
                  className="shadow-sm custom-input"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
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
                  min={new Date().toISOString().split("T")[0]} // Set minimum date to today
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
                  min={fromDate || new Date().toISOString().split("T")[0]} // Set minimum date to from date or today
                  required
                />
              </Form.Group>

              {dateError && (
                <div className="alert alert-danger">{dateError}</div>
              )}

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
                    <>
                      <FaPlaneDeparture className="me-2" /> Submit Leave Request
                    </>
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
