import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import default_img from "../../../assets/Default_pfp.svg.png";

const Profile = () => {
  const [supervisorData, setSupervisorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [areaName, setAreaName] = useState("");
  const [reportingRadius, setReportingRadius] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const token = localStorage.getItem("token");

  const fetchingSupervisorData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/supervisor/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSupervisorData(res.data.currentSupervisor);
    } catch (err) {
      toast.error("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingSupervisorData();
  }, []);

  const handleVerify = async () => {
    if (!latitude || !longitude) {
      toast.warning("Please enter both latitude and longitude.");
      return;
    }

    try {
      setVerifying(true);
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );

      const place = res.data.results[0];
      if (place) {
        setAreaName(place.formatted);
        setVerified(true);
        // toast.success("Location verified successfully!");
      } else {
        toast.error("Could not find location.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify location.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSave = async () => {
    if (!verified) {
      toast.warning("Please verify the location before saving.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/supervisor/add-reporting-location`,
        {
          latitude,
          longitude,
          areaName,
          reportingRadius
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Location saved successfully!");
      setShowModal(false);
      setLatitude("");
      setLongitude("");
      setAreaName("");
      setReportingRadius("");
      setVerified(false);
      fetchingSupervisorData();
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("Failed to save location.");
    }
  };

  const handleSaveTime = async () => {
    if (!checkInTime || !checkOutTime) {
      toast.warning("Please fill both Check-In and Check-Out time.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/supervisor/save-checkin-checkout`,
        {
          checkInTime,
          checkOutTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Check-In/Check-Out time saved successfully!");
      fetchingSupervisorData();
      setCheckInTime("");
      setCheckOutTime("");
    } catch (error) {
      console.error("Error saving time:", error);
      toast.error("Failed to save time.");
    }
  };

  useEffect(() => {
    if (showModal) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude.toFixed(6));
            setLongitude(position.coords.longitude.toFixed(6));
          },
          (error) => {
            console.warn("Geolocation error:", error);
            toast.warn("Unable to fetch your location. Please enter manually.");
          }
        );
      } else {
        toast.warn("Geolocation is not supported by this browser.");
      }
    }
  }, [showModal]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <div className="text-center">
          <img
            src={default_img}
            alt="Supervisor"
            className="rounded-circle border border-3 border-primary"
            width="130"
            height="130"
          />
          <h3 className="mt-3">{supervisorData.name}</h3>
          <p className="text-muted">{supervisorData.email}</p>
        </div>

        {/* Stats */}
        <div className="row text-center mt-4">
          <div className="col-md-4 mb-3">
            <h6 className="text-muted">Total Employees</h6>
            <p className="fw-bold fs-5">{supervisorData.totalEmployees || 0}</p>
          </div>
          <div className="col-md-4 mb-3">
            <h6 className="text-muted">Clients</h6>
            <p className="fw-bold fs-5">{supervisorData.totalClients || 0}</p>
          </div>
          <div className="col-md-4 mb-3">
            <h6 className="text-muted">Locations</h6>
            <p className="fw-bold fs-5">{supervisorData.totalLocations || 0}</p>
          </div>
        </div>

        <hr />

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3" id="profileTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="basic-tab"
              data-bs-toggle="tab"
              data-bs-target="#basic"
              type="button"
              role="tab"
            >
              Basic Info
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="location-tab"
              data-bs-toggle="tab"
              data-bs-target="#location"
              type="button"
              role="tab"
            >
              Location Info
            </button>
          </li>
        </ul>

        <div className="tab-content" id="profileTabsContent">
          {/* Basic Info Tab */}
          <div className="tab-pane fade show active" id="basic" role="tabpanel">
            <div className="row">
              <div className="col-md-6 mb-3">
                <h6 className="text-muted">Name</h6>
                <p className="fw-semibold">{supervisorData.name}</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="text-muted">Contact</h6>
                <p className="fw-semibold">{supervisorData.contact}</p>
              </div>
            </div>
          </div>

          {/* Location Info Tab */}
          <div className="tab-pane fade" id="location" role="tabpanel">
            <div className="row">
              {/* <div className="col-md-6 mb-3">
                <h6 className="text-muted">Location</h6>
                <p className="fw-semibold">
                  {supervisorData.location || (
                    <span className="text-danger">Not Set</span>
                  )}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="text-muted">State</h6>
                <p className="fw-semibold">
                  {supervisorData.state || (
                    <span className="text-danger">Not Set</span>
                  )}
                </p>
              </div> */}
              <div className="col-md-6 mb-3">
                <h6 className="text-muted">Latitude</h6>
                <p className="fw-semibold">
                  {supervisorData.reportingLocation.latitude || (
                    <span className="text-danger">Not Set</span>
                  )}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="text-muted">Longitude</h6>
                <p className="fw-semibold">
                  {supervisorData.reportingLocation.longitude || (
                    <span className="text-danger">Not Set</span>
                  )}
                </p>
              </div>
              <div className="col-md-12 mb-3">
                <h6 className="text-muted">Area Name</h6>
                <p className="fw-semibold">
                  {supervisorData.reportingLocation.areaName || (
                    <span className="text-danger">Not Set</span>
                  )}
                </p>
              </div>
              <div className="col-md-12 mb-3">
                <h6 className="text-muted">Reporting Radius</h6>
                <p className="fw-semibold">
                  {supervisorData.reportingLocation.reportingRadius || (
                    <span className="text-danger">Not Set</span>
                  )}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="text-muted">Check-In Time</h6>
                <p className="fw-semibold">
                  {supervisorData.checkInTime ? (
                    supervisorData.checkInTime
                  ) : (
                    <span className="text-danger">Not Available</span>
                  )}
                </p>
              </div>

              <div className="col-md-6 mb-3">
                <h6 className="text-muted">Check-Out Time</h6>
                <p className="fw-semibold">
                  {supervisorData.checkOutTime ? (
                    supervisorData.checkOutTime
                  ) : (
                    <span className="text-danger">Not Available</span>
                  )}
                </p>
              </div>
              <div className="col-12 mt-3 d-flex justify-content-between align-items-center">
                <button
                  className="btn btn-primary w-100 d-flex justify-content-between align-items-center"
                  onClick={() => setShowModal(true)}
                >
                  Add Reporting Location
                </button>
              </div>

              {/* Check-in/out time inputs */}
              <div className="col-12 mt-4">
                <h6 className="text-muted">Update Check-In & Check-Out Time</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input
                      type="time"
                      className="form-control"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="time"
                      className="form-control"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-success w-100"
                  onClick={handleSaveTime}
                >
                  Save Check-In/Out Time
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for reporting location */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title ">Add Reporting Location</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setLatitude("");
                    setLongitude("");
                    setAreaName("");
                    setReportingRadius("");
                    setVerified(false);
                  }}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Latitude</label>
                  <input
                    type="text"
                    className="form-control"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Longitude</label>
                  <input
                    type="text"
                    className="form-control"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Reporting Radius</label>
                  <input
                    type="text"
                    className="form-control"
                    value={reportingRadius}
                    onChange={(e) => setReportingRadius(e.target.value)}
                  />
                </div>
                {verified && (
                  <div className="alert alert-success mt-3">
                    <strong>Area Name:</strong> {areaName}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setLatitude("");
                    setLongitude("");
                    setAreaName("");
                    setVerified(false);
                  }}
                >
                  Close
                </button>
                {!verified ? (
                  <button
                    className="btn btn-success"
                    onClick={handleVerify}
                    disabled={verifying}
                  >
                    {verifying ? "Verifying..." : "Verify"}
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
