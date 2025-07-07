import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


/* ---------- helper for responsive preview ---------- */
const MM_TO_PX = 3.78;           // 1 mm ≈ 3.78 px @ 96 DPI
const A4_WIDTH_MM  = 210;
const A4_HEIGHT_MM = 297;
const calculateScale = () => {
  const availableWidth  = window.innerWidth  - 40;
  const availableHeight = window.innerHeight - 40;
  const widthScale  = availableWidth  / (A4_WIDTH_MM  * MM_TO_PX);
  const heightScale = availableHeight / (A4_HEIGHT_MM * MM_TO_PX);
  return Math.min(widthScale, heightScale, 1);
};

const ShowOfferLetter = () => {
  const [offerLetter, setOfferLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [userSignature, setUserSignature] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState({ x: 90, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(calculateScale());
  const pageRef = useRef(null);
  const offerRef = useRef();
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  // Fetch user's signature
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.signature) {
          setUserSignature(response.data.signature);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token]);

  useEffect(() => {
    const fetchOfferLetter = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/offer-letter/user/offer-letter/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          setOfferLetter(response.data);
          setStatus(response.data.status || "sent");
          // If offer is already accepted, set the saved signature position
          if (
            response.data.status === "accepted" &&
            response.data.employeeSignaturePosition
          ) {
            setSignaturePosition(response.data.employeeSignaturePosition);
          }
        } else {
          setError("Invalid offer letter data format");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching offer letter:", error);
        if (error.response?.status === 403) {
          setError("You do not have permission to view this offer letter");
        } else if (error.response?.status === 404) {
          setError("Offer letter not found");
        } else {
          setError("Failed to load offer letter. Please try again later.");
        }
        setLoading(false);
      }
    };

    if (id && token) {
      fetchOfferLetter();
    } else {
      setError("Invalid offer letter ID or authentication token");
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    const handleResize = () => {
      const newScale = calculateScale();
      setScale(newScale);
    };

    handleResize(); // Initial calculation
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAccept = async () => {
    try {
      if (!userSignature) {
        toast.error(
          "Please upload your signature in your profile before accepting the offer letter"
        );
        return;
      }

      // Get the current signature position
      const currentSignaturePosition = {
        x: signaturePosition.x,
        y: signaturePosition.y,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/offer-letter/user/offer-letter/${id}/respond`,
        {
          response: "accept",
          signaturePosition: currentSignaturePosition,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setStatus("accepted");
        toast.success("Offer letter accepted successfully!");
      } else {
        toast.error(response.data.message || "Failed to accept offer letter");
      }
    } catch (error) {
      console.error("Error accepting offer letter:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to accept offer letter";
      toast.error(errorMessage);
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/offer-letter/user/offer-letter/${id}/respond`,
        { response: "reject" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setStatus("rejected");
        toast.success("Offer letter rejected successfully!");
      } else {
        toast.error(response.data.message || "Failed to reject offer letter");
      }
    } catch (error) {
      console.error("Error rejecting offer letter:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to reject offer letter";
      toast.error(errorMessage);
    }
  };

  // Signature dragging handlers
  const handleMouseDown = (e) => {
    if (status !== 'sent') return; // Prevent dragging if already accepted/rejected
    setIsDragging(true);
    e.preventDefault(); // Prevent text selection while dragging
  };

  const handleMouseMove = (e) => {
    if (!isDragging || status !== 'sent') return;
    
    const container = e.currentTarget.getBoundingClientRect();
    const scale = calculateScale();
    
    // Calculate position relative to container, accounting for scale
    const x = Math.min(
      Math.max((e.clientX - container.left) / scale, 75), // Minimum 75px from left
      container.width / scale - 75 // Maximum width-75px from left
    );
    const y = Math.min(
      Math.max((e.clientY - container.top) / scale, 30), // Minimum 30px from top
      container.height / scale - 30 // Maximum height-30px from top
    );
    
    setSignaturePosition({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (userSignature && status === "sent") {
      // Set initial position to center of signature area
      setSignaturePosition({
        x: 150, // Half of container width
        y: 60, // Half of container height
      });
    }
  }, [userSignature]);

  const ZoomControls = () => (
    <div className="zoom-controls">
      <button
        onClick={() => setScale((prev) => Math.min(1, prev + 0.1))}
        title="Zoom in"
      >
        +
      </button>
      <button
        onClick={() => setScale((prev) => Math.max(0.3, prev - 0.1))}
        title="Zoom out"
      >
        -
      </button>
      <button onClick={() => setScale(calculateScale())} title="Reset zoom">
        Reset
      </button>
    </div>
  );

  /* ---------- PDF download WITHOUT whitespace ------------- */
  const handleDownloadPDF = () => {
  const element = offerRef.current;

  if (!element) {
    toast.error("Offer letter content not found.");
    return;
  }

  // Temporarily remove scaling
  const prevTransform = element.style.transform;
  const prevTransformOrigin = element.style.transformOrigin;
  element.style.transform = "scale(1)";
  element.style.transformOrigin = "top left";

  const images = element.querySelectorAll("img");
  const imagePromises = Array.from(images).map(
    (img) =>
      new Promise((resolve) => {
        if (img.complete) resolve();
        else img.onload = img.onerror = resolve;
      })
  );

  Promise.all(imagePromises).then(() => {
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = {
        width: canvas.width,
        height: canvas.height,
      };

      const ratio = imgProps.width / imgProps.height;
      const pageWidth = pdfWidth;
      const pageHeight = pageWidth / ratio;

      pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
      pdf.save("OfferLetter.pdf");

      // Restore transform
      element.style.transform = prevTransform;
      element.style.transformOrigin = prevTransformOrigin;
    });
  });
};

  /* -------------------------------------------------------- */

  /* ---------- responsive preview scaling on resize -------- */
  useEffect(() => {
    const handleResize = () => setScale(calculateScale());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  /* -------------------------------------------------------- */



  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading offer letter...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/user_dashboard/offer-letters")}
        >
          Back to List
        </button>
      </div>
    );
  }

  if (!offerLetter) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">Offer letter not found</div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/user_dashboard/offer-letters")}
        >
          Back to List
        </button>
      </div>
    );
  }

  const { letterContent, documentStyle, assets } = offerLetter;
  const { companyInfo, content, signatures } = letterContent;

  // Function to safely render HTML content
  const renderHTML = (content) => {
    if (!content) return null;
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }}
      />
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center m-md-3 mb-3">
        <h3>Offer Letter</h3>
        <div className="d-flex gap-2">
          {status === "sent" && (
            <>
              {!userSignature && (
                <div className="text-danger me-2">
                  * Please upload your signature in profile before accepting
                </div>
              )}
              <button
                className="btn btn-success"
                onClick={handleAccept}
                disabled={!userSignature}
              >
                Accept
              </button>
              <button className="btn btn-danger" onClick={handleReject}>
                Reject
              </button>
            </>
          )}
          {status === "accepted" && (
            <button className="btn btn-primary" onClick={handleDownloadPDF}>
              Download PDF
            </button>
          )}
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/user_dashboard/offer-letters")}
          >
            Back to List
          </button>
        </div>
      </div>
      <div className="container py-4">
        <div className="page-wrapper">
          <div
            ref={offerRef}
            className="a4-page"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center",
              width: "210mm",
              height: "297mm",
              objectFit: "contain",
            }}
          >
            <div
              className="header d-flex justify-content-between align-items-center"
              style={{ flexDirection: "row" }}
            >
              {assets?.logo && (
                <div
                  className="logo-container-user"
                  style={{
                    width: documentStyle?.logoSize?.width || "100px",
                    marginRight: "20px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    background: "transparent",
                  }}
                >
                  <img
                    crossOrigin="anonymous"
                    src={`${process.env.REACT_APP_BACKEND_URL}${assets.logo}`}
                    alt="Company Logo"
                    className="logo"
                    style={{
                      width: "100%",
                      background: "transparent",
                    }}
                  />
                </div>
              )}
              <div
                className={`company-details ${!assets?.logo ? "w-100" : ""}`}
              >
                <h5 className="company-name text-end">{companyInfo.name}</h5>
                <div
                  className="text-end"
                  style={{ marginBottom: "0rem", paddingBottom: "0.2rem" }}
                >
                  {companyInfo.address}
                </div>
                <div
                  className="contact-info text-end"
                  style={{ marginTop: "0rem", paddingTop: "0.2rem" }}
                >
                  Email: {companyInfo.email}
                  {companyInfo.phone && (
                    <>
                      <span className="mx-1">,</span>
                      PH NO-{companyInfo.phone}
                    </>
                  )}
                </div>
              </div>
            </div>

            <hr className="divider" />

            <div className="letter-title text-center my-4">
              <h2 className="text-decoration-underline">Offer Letter</h2>
            </div>

            <div
              className="letter-body"
              style={{
                fontSize: documentStyle?.fontSize || "16px",
                fontFamily: documentStyle?.fontFamily || "Arial, sans-serif",
                whiteSpace: "pre-line",
              }}
            >
              {renderHTML(content)}
            </div>

            <div className="signature-section mt-5">
              <div className="row align-items-end">
                <div className="col-6">
                  <p>Sincerely,</p>
                  <p className="mt-4">FOR {companyInfo.name}</p>
                  {assets?.signature && (
                    <div
                      style={{
                        width: documentStyle?.signatureSize?.width || 150,
                        height: documentStyle?.signatureSize?.height || 80,
                        position: "relative",
                        left: documentStyle?.signaturePosition?.x || 0,
                        top: documentStyle?.signaturePosition?.y || 0,
                      }}
                    >
                      <img
                        crossOrigin="anonymous"
                        src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${assets.signature}`}
                        alt="Authorized Signature"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}
                  <p className="mt-4">
                    {signatures?.company?.designation || "Authorized Signatory"}
                  </p>
                </div>
                <div className="col-6 text-end">
                  <p className="mt-0">{offerLetter.userId?.full_Name || ""}</p>
                  <div
                    className="signature-area"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      position: "relative",
                      height: status === "sent" ? "120px" : "100px",
                      border: status === "sent" ? "1px dashed #dee2e6" : "none",
                      borderRadius: "4px",
                      marginBottom: "0px",
                      cursor: status === "sent" ? "move" : "default",
                    }}
                  >
                    {userSignature && (
                      <img
                        crossOrigin="anonymous"
                        src={`${process.env.REACT_APP_BACKEND_URL}${userSignature}`}
                        alt="Your Signature"
                        style={{
                          width: "150px",
                          position: "absolute",
                          left: `${
                            status === "accepted"
                              ? offerLetter.documentStyle
                                  .employeeSignaturePosition?.x || 0
                              : signaturePosition.x
                          }px`,
                          top: `${
                            status === "accepted"
                              ? offerLetter.documentStyle
                                  .employeeSignaturePosition?.y || 0
                              : signaturePosition.y
                          }px`,
                          cursor: status === "sent" ? "move" : "default",
                          userSelect: "none",
                          pointerEvents: "none",
                          transform: "translate(-50%, -50%)",
                        }}
                        draggable={false}
                      />
                    )}
                  </div>
                  <p className="mt-0">
                    {signatures?.employee?.designation || "Employee Signature"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {status === "sent" && userSignature && (
          <div className="text-muted text-center mt-3">
            * Drag your signature to position it before accepting
          </div>
        )}
        <ZoomControls />
      </div>
    </>
  );
};

export default ShowOfferLetter;
