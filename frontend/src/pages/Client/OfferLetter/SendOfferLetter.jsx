import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Rnd } from "react-rnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OfferLetter.css"; // Custom styling

const OfferLetter = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const token = localStorage.getItem("token");
  const employeeId = location.state?.employeeId;

  const [offerData, setOfferData] = useState({
    position: "Delivery Associate",
    salary: "Rs-19000/-",
    incentive: "2000",
    reportingTo: "Side Incharge",
    supervisor: "Sushant Gupta",
    workingHours: "9AM to 6PM",
    startDay: "Monday",
    endDay: "Saturday",
    joiningDate: "10-03-2025",
    joiningTime: "5:00 AM",
    reportingPerson: "Yogesh Kumar Sharma",
    acceptanceDate: "11-03-2025",
  });

  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState({ width: 150, height: 100 });
  const [logoPosition, setLogoPosition] = useState({ x: 20, y: 20 });

  const pageRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/client/employee/${employeeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data.employee);
      } catch (error) {
        toast.error("Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) fetchUserData();
  }, [employeeId]);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="text-center mb-3">
        <button className="btn btn-primary" onClick={triggerFileInput}>
          Upload Logo
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleLogoUpload}
          style={{ display: "none" }}
        />
      </div>

      <div ref={pageRef} className="offer-letter">
        <div className="header d-flex justify-content-between align-items-center">
          {logo && (
            <Rnd
              size={{ width: logoSize.width, height: logoSize.height }}
              position={{ x: logoPosition.x, y: logoPosition.y }}
              onDragStop={(e, d) => setLogoPosition({ x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => {
                setLogoSize({ width: ref.offsetWidth, height: ref.offsetHeight });
                setLogoPosition(position);
              }}
              bounds="parent"
              minWidth={100}
              minHeight={50}
            >
              <img src={logo} alt="Company Logo" className="logo" />
            </Rnd>
          )}
          <div className="text-end">
            <h5 className="company-name">URIDE TOUR AND TRANSPORT PRIVATE LIMITED</h5>
            <p>Plot No-15, Ground Floor, Gali NO 5, Baprola</p>
            <p>Jai Vihar, Nangloi Najafgarh Road, Najafgarh-110041</p>
            <p>
              Email: <a href="mailto:info@uride.in">info@uride.in</a>, PH: <strong>01145642185</strong>
            </p>
          </div>
        </div>

        <hr />

        <br />
        <h4 className="text-center fw-bold">Offer Letter</h4>
        <br />

        <div className="d-flex justify-content-between">
          <div>
            <strong>{userData?.full_Name}</strong>
            <p>{userData?.address}</p>
          </div>
          <div>
            <strong>Date:</strong> {offerData.joiningDate}
          </div>
        </div>

        <p>Dear {userData?.full_Name},</p>
        <p>
          Congratulations! We are pleased to confirm that you have been selected to work for{" "}
          <strong>URIDE TOUR AND TRANSPORT PRIVATE LIMITED</strong>. We are delighted to offer you the following job.
        </p>

        <p>
          The position we are offering is <strong>{offerData.position}</strong> with a monthly salary of{" "}
          <strong>{offerData.salary}</strong> + <strong>{offerData.incentive}</strong> incentive.
          You will be reporting to <strong>{offerData.supervisor}</strong>, and your working hours will be{" "}
          <strong>{offerData.workingHours}</strong>, from <strong>{offerData.startDay}</strong> to{" "}
          <strong>{offerData.endDay}</strong>.
        </p>

        <h6>Benefits for the position include:</h6>
        <ul>
          <li>Employer State Insurance Corporation (ESIC) Coverage</li>
        </ul>

        <p>
          We would like you to start work on <strong>{offerData.joiningDate}</strong> at{" "}
          <strong>{offerData.joiningTime}</strong>. Please report to <strong>{offerData.reportingPerson}</strong> for
          documentation and orientation. If this date is not acceptable, please contact us immediately.
        </p>

        <p>
          Please sign the enclosed copy of this letter and return it by <strong>{offerData.acceptanceDate}</strong> to
          indicate your acceptance of this offer.
        </p>

        <p>
          We are confident that you will make a significant contribution to the success of{" "}
          <strong>URIDE TOUR AND TRANSPORT PRIVATE LIMITED</strong> and look forward to working with you.
        </p>

        <h6>Sincerely,</h6>

        <div className="d-flex justify-content-between mt-5">
          <div>
            <strong>FOR URIDE TOUR AND TRANSPORT PRIVATE LIMITED</strong>
            <br />
            <br />
            <br />
            <span className="signature">Authorized Signatory</span>
          </div>
          <div>
            <strong>{userData?.full_Name}</strong>
            <br />
            <br />
            <br />
            <span className="signature">Receiving Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferLetter;
