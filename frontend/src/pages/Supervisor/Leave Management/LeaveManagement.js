import React, { useEffect, useState } from "react";
import "./LeaveManagement.css";
import { FaSearch } from "react-icons/fa";
import CustomDropdown from "../../../components/CustomDropdown/CustomDropdown";
import axios from "axios";

import { toast } from "react-toastify";

const sampleRequests = [
  {
    id: 1,
    name: "John Doe",
    leaveType: "Sick Leave",
    from: "2025-06-10",
    to: "2025-06-12",
    status: "Pending",
    reason: "Fever and cold",
  },
  {
    id: 2,
    name: "Jane Smith",
    leaveType: "Casual Leave",
    from: "2025-06-15",
    to: "2025-06-17",
    status: "Approved",
    reason: "Family function",
  },
  {
    id: 3,
    name: "Alex Johnson",
    leaveType: "Earned Leave",
    from: "2025-06-05",
    to: "2025-06-08",
    status: "Rejected",
    reason: "Insufficient leave balance",
  },
  {
    id: 4,
    name: "Emily Brown",
    leaveType: "Sick Leave",
    from: "2025-06-20",
    to: "2025-06-22",
    status: "Pending",
    reason: "Migraine",
  },
];

const avatarColors = [
  "007bff", // blue
  "28a745", // green
  "fd7e14", // orange
  "6f42c1", // purple
  "e83e8c", // pink
  "20c997", // teal
  "ffc107", // yellow
  "dc3545", // red
];

// Helper function to calculate days between two dates (inclusive)
function getDurationDays(from, to) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffTime = toDate - fromDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

const LeaveManagement = () => {
  const [requests, setRequests] = useState(sampleRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null); // Track expanded item
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [establishment, setEstablishment] = useState({});

  const token = localStorage.getItem("token");

  const [showAllotModal, setShowAllotModal] = useState(false);
  const [allotValues, setAllotValues] = useState({
    casual: "",
    annual: "",
    medical: "",
  });

  const handleAllotChange = (e) => {
    setAllotValues({ ...allotValues, [e.target.name]: e.target.value });
  };

  const handleAllotSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add your API call or logic here

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/establishment/leave-page/allot-leave`,
      {
        casual: allotValues.casual,
        annual: allotValues.annual,
        medical: allotValues.medical,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      toast.success("Leave allotted successfully!");
      setEstablishment(response.data.establishment);
    }
      
    setShowAllotModal(false);
    setAllotValues({ casual: "", annual: "", medical: "" });
  };

  // const handleAction = (id, newStatus) => {
  //   const updated = requests.map((req) =>
  //     req.id === id ? { ...req, status: newStatus } : req
  //   );
  //   setRequests(updated);
  // };

  const handleAction = async (id, newStatus) => {
    try {
      console.log(`Updating request ${id} to status ${newStatus}`);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/supervisor/leave-page/leave-response/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaveRequests(response.data.leaveRequests);
      toast.success(
        `Request ${newStatus === "Approved" ? "accepted" : "rejected"}!`
      );
    } catch (error) {
      toast.error("Failed to update leave status");
    }
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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id); // Toggle expanded state
  };

  const filteredRequests =
    leaveRequests &&
    leaveRequests.filter((req) => {
      const matchesSearch = req.user_id.full_Name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/supervisor/leave-page/leave-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLeaveRequests(response.data.leaveRequests);
        setEstablishment(response.data.establishment);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [token]);

  return (
    <div className="dashboard">
      <h2 className="title">Leave Management</h2>
      <p className="subtitle">Review and manage employee leave requests</p>
      <div className="leave-header-row">
        <div className="leave-header-pills">
          <span className="leave-pill casual">Casual Leave : {establishment && establishment.casualLeave}</span>
          <span className="leave-pill medical">Medical Leave : {establishment && establishment.medicalLeave}</span>
          <span className="leave-pill annual">Annual Leave : {establishment && establishment.annualLeave}</span>
        </div>
        {/* <button className="allot-leave-btn" onClick={() => setShowAllotModal(true)}>Allot Leave</button> */}
      </div>

      {showAllotModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Allot Leave</h3>
            <form onSubmit={handleAllotSubmit}>
              <label>
                Casual Leave:
                <input
                  type="number"
                  name="casual"
                  value={allotValues.casual}
                  onChange={handleAllotChange}
                  min="0"
                  required
                />
              </label>
              <label>
                Annual Leave:
                <input
                  type="number"
                  name="annual"
                  value={allotValues.annual}
                  onChange={handleAllotChange}
                  min="0"
                  required
                />
              </label>
              <label>
                Medical Leave:
                <input
                  type="number"
                  name="medical"
                  value={allotValues.medical}
                  onChange={handleAllotChange}
                  min="0"
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAllotModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="allot-btn">
                  Allot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="filters">
        <div className="search-container">
          <span className="search-icon">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="select-container">
          <CustomDropdown
            options={["All", "Pending", "Approved", "Rejected"]}
            selected={statusFilter}
            onSelect={(value) => setStatusFilter(value)}
          />
        </div>
      </div>

      <div className="request-list-flex">
        <div className="request-list-header">
          <div></div>
          <div>Name</div>
          <div>Leave Type</div>
          <div>Duration</div>
          <div>Status</div>
        </div>
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req, idx) => (
            <div key={idx}>
              <div
                className="request-list-row"
                onClick={() => toggleExpand(idx)} // Toggle expand on click
              >
                <div data-label="Photo">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      req.user_id.full_Name
                    )}&background=${
                      avatarColors[idx % avatarColors.length]
                    }&color=fff`}
                    alt="avatar"
                    className="avatar"
                  />
                </div>
                <div data-label="Name">{req.user_id.full_Name}</div>
                <div data-label="Leave Type">{req.leaveType}</div>
                <div data-label="Duration">
                  {getDurationDays(req.from, req.to)} days
                </div>
                <div data-label="Status">
                  <span className={`status-badge ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </div>
              </div>
              {expandedId === idx && (
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
                      <div className="value">{req.supervisor_id.name}</div>
                    </div>
                    <div>
                      <div className="label">Leave Type</div>
                      <div className="value">{req.leaveType}</div>
                    </div>
                    <div>
                      <div className="label">Remaining Leave</div>
                      <div className="leave-badges">
                        <span className="leave-pill casual">
                          Casual: {establishment.casualLeave - req.user_id.casualLeave}
                        </span>
                        <span className="leave-pill annual">
                          Annual: {establishment.annualLeave - req.user_id.annualLeave}
                        </span>
                        <span className="leave-pill medical">
                          Medical: {establishment.medicalLeave - req.user_id.medicalLeave}
                        </span>
                      </div>
                    </div>
                  </div>
                  {req.status === "Pending" && (
                    <div className="action-btns">
                      <button
                        className="accept-btn"
                        onClick={() => handleAction(req._id, "Approved")}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleAction(req._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">No leave requests found.</div>
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;
