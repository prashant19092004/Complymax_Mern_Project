import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Rnd } from "react-rnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OfferLetter.css"; // Custom styling
import EditableField from "./EditableField";

const calculateScale = () => {
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;
    const MM_TO_PX = 3.78; // 1mm = 3.78px at 96 DPI

    const availableWidth = window.innerWidth - 40; // Account for padding
    const availableHeight = window.innerHeight - 40; // Account for padding

    const widthScale = availableWidth / (A4_WIDTH_MM * MM_TO_PX);
    const heightScale = availableHeight / (A4_HEIGHT_MM * MM_TO_PX);

    // Use the smaller scale to maintain aspect ratio
    return Math.min(widthScale, heightScale, 1);
};

const OfferLetter = () => {
  const [userData, setUserData] = useState(null);
  const [establishmentData, setEstablishmentData] = useState(null);
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

  const [logoSize, setLogoSize] = useState({ width: 150, height: 100 });
  const [logoPosition, setLogoPosition] = useState({ x: 20, y: 20 });
  const [logoError, setLogoError] = useState(false);

  const [signatureSize, setSignatureSize] = useState({
    width: 150,
    height: 80,
  });
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });
  const [signatureError, setSignatureError] = useState(false);

  const pageRef = useRef(null);

  const [scale, setScale] = useState(calculateScale());

  const [editableContent, setEditableContent] = useState({
    companyName: "",
    address: "",
    email: "",
    phone: "",
    employeeName: "",
    employeeAddress: "",
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
    offerDetails: "",
    fullContent: `Dear [Mr./Miss./Mrs./Ms.] SURAJ KUMAR S/O Sri SANJAY KUMAR],

Congratulations! We are pleased to confirm that you have been selected to work for [URIDE TOUR AND TRANSPORT PRIVATE LIMITED]. We are delighted to make you the following job offer.

The position we are offering you is that of [Delivery Associate] at a monthly salary of [Rs-19000/-]+ 2000 inc. This position reports to [Side Incharge], [Sushant Gupta]. Your working hours will be from [9AM to 6PM], [Starting Weekday] to [Ending Week Day].

Benefits for the position include: (Use if relevant to the position)
• Benefit B (Employer State Insurance Corporation ESIC Coverage)

We would like you to start work on [10-03-2025] at [5:00 AM]. Please report to [Yogesh Kumar Sharma], for documentation and orientation. If this date is not acceptable, please contact me immediately.

Please sign the enclosed copy of this letter and return it to me by 11-03-2025] to indicate your acceptance of this offer.

We are confident you will be able to make a significant contribution to the success of our [URIDE TOUR AND TRANSPORT PRIVATE LIMITED] and look forward to working with you.
`,
  });

  const [isAccepted, setIsAccepted] = useState(false);
  const [userSignature, setUserSignature] = useState(null);
  const [userSignaturePosition, setUserSignaturePosition] = useState(null);

  // Add these state variables for tracking the content
  const [offerDetailsText, setOfferDetailsText] = useState("");
  const [joiningInstructionsText, setJoiningInstructionsText] = useState("");
  const [acceptanceInstructionsText, setAcceptanceInstructionsText] =
    useState("");

  useEffect(() => {
    const handleResize = () => {
        const newScale = calculateScale();
        setScale(newScale);
    };

    handleResize(); // Initial calculation
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ZoomControls = () => (
    <div className="zoom-controls">
      <button 
            onClick={() => setScale(prev => Math.min(1, prev + 0.1))}
        title="Zoom in"
      >
        +
      </button>
      <button 
        onClick={() => setScale(prev => Math.max(0.3, prev - 0.1))}
        title="Zoom out"
      >
        -
      </button>
      <button 
            onClick={() => setScale(calculateScale())}
        title="Reset zoom"
      >
        Reset
      </button>
    </div>
  );

  // Add this function to update all editable content from saved data
  const updateContentFromSavedData = (savedLetterContent) => {
    if (!savedLetterContent) {
      // Set default content if no saved content exists
      setEditableContent((prev) => ({
        ...prev,
        fullContent: `Dear [Mr./Miss./Mrs./Ms.] ${
          userData?.full_Name || "SURAJ KUMAR S/O Sri SANJAY KUMAR"
        },

Congratulations! We are pleased to confirm that you have been selected to work for ${
          establishmentData?.name || "URIDE TOUR AND TRANSPORT PRIVATE LIMITED"
        }. We are delighted to make you the following job offer.

The position we are offering you is that of ${
          offerData.position
        } at a monthly salary of ${offerData.salary}+ ${
          offerData.incentive
        } inc. This position reports to ${offerData.reportingTo}, ${
          offerData.supervisor
        }. Your working hours will be from ${offerData.workingHours}, ${
          offerData.startDay
        } to ${offerData.endDay}.

Benefits for the position include: (Use if relevant to the position)
• Benefit B (Employer State Insurance Corporation ESIC Coverage)

We would like you to start work on ${offerData.joiningDate} at ${
          offerData.joiningTime
        }. Please report to ${
          offerData.reportingPerson
        }, for documentation and orientation. If this date is not acceptable, please contact me immediately.

Please sign the enclosed copy of this letter and return it to me by ${
          offerData.acceptanceDate
        } to indicate your acceptance of this offer.

We are confident you will be able to make a significant contribution to the success of our ${
          establishmentData?.name || "URIDE TOUR AND TRANSPORT PRIVATE LIMITED"
        } and look forward to working with you.
`,
        companyName: establishmentData?.name,
        address: establishmentData?.address,
        email: establishmentData?.email,
        phone: establishmentData?.phone,
        employeeName: userData?.full_Name,
      }));
      return;
    } else {
      setEditableContent((prev) => ({
        ...prev,
        companyName: savedLetterContent.companyInfo.name,
        address: savedLetterContent.companyInfo.address,
        email: savedLetterContent.companyInfo.email,
        phone: savedLetterContent.companyInfo.phone,
        employeeName: savedLetterContent.signatures.employee.name,
        fullContent: savedLetterContent.content,
      }));
      return;
    }
  };

  // Update the useEffect where we fetch the offer letter
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, establishmentResponse] = await Promise.all([
          axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/client/employee/${employeeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
          ),
          axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/establishment/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        setUserData(userResponse.data.employee);
        const establishmentInfo = establishmentResponse.data.data;
        setEstablishmentData({
          ...establishmentInfo,
          logo: establishmentInfo.logo || null,
          signature: establishmentInfo.signature || null,
        });
        
        // Fetch existing offer letter if it exists
        if (userResponse.data.employee.hired) {
          try {
            const offerLetterResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/offer-letter/${userResponse.data.employee.hired._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (offerLetterResponse.data) {
              setIsAccepted(
                offerLetterResponse.data.offerLetter.status === "accepted"
              );
              
              // Update content from saved letter
              // console.log("offerLetterResponse.data.offerLetter.letterContent", offerLetterResponse.data.offerLetter.letterContent);
              updateContentFromSavedData(
                offerLetterResponse.data.offerLetter.letterContent
              );
              
              // Update document styling if available
              if (offerLetterResponse.data.offerLetter.documentStyle) {
                if (
                  offerLetterResponse.data.offerLetter.documentStyle
                    .logoPosition
                ) {
                  setLogoPosition(
                    offerLetterResponse.data.offerLetter.documentStyle
                      .logoPosition
                  );
                }
                if (
                  offerLetterResponse.data.offerLetter.documentStyle.logoSize
                ) {
                  setLogoSize(
                    offerLetterResponse.data.offerLetter.documentStyle.logoSize
                  );
                }
                if (
                  offerLetterResponse.data.offerLetter.documentStyle
                    .signaturePosition
                ) {
                  setSignaturePosition(
                    offerLetterResponse.data.offerLetter.documentStyle
                      .signaturePosition
                  );
                }
                if (
                  offerLetterResponse.data.offerLetter.documentStyle
                    .signatureSize
                ) {
                  setSignatureSize(
                    offerLetterResponse.data.offerLetter.documentStyle
                      .signatureSize
                  );
                }
                if (
                  offerLetterResponse.data.offerLetter.assets.employeeSignature
                ) {
                  setUserSignature(
                    offerLetterResponse.data.offerLetter.assets
                      .employeeSignature
                  );
                }

                if (
                  offerLetterResponse.data.offerLetter.documentStyle
                    .employeeSignaturePosition
                ) {
                  setUserSignaturePosition(
                    offerLetterResponse.data.offerLetter.documentStyle
                      .employeeSignaturePosition
                  );
                }
              }
            }
          } catch (offerLetterError) {
            console.log("No existing offer letter found:", offerLetterError);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch required data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) fetchData();
  }, [employeeId, token]);

 

  // Update the sanitizeHtml function to preserve line breaks
  const sanitizeHtml = (html) => {
    if (!html) return "";
    // Preserve line breaks while cleaning HTML
    return html
      .replace(/<(?!\/?(?:strong|br|p|div)[^>]*>)[^>]+>/g, "")
      .replace(/\r\n/g, "\n") // Normalize line endings
      .replace(/\r/g, "\n") // Normalize line endings
      .trim();
  };

  // Update the handleContentChange function
  const handleContentChange = (field, value) => {
    if (isAccepted) return; // Don't allow changes if accepted
    
    const cleanValue = sanitizeHtml(value);
    
    setEditableContent((prev) => {
      if (prev[field] === cleanValue) {
        return prev;
      }
      
      const newContent = {
        ...prev,
        [field]: cleanValue,
      };

      if (
        [
          "position",
          "salary",
          "incentive",
          "supervisor",
          "workingHours",
          "startDay",
          "endDay",
        ].includes(field)
      ) {
        newContent.offerDetails = generateOfferDetailsText(newContent);
      }

      return newContent;
    });

    if (field in offerData) {
      setOfferData((prev) => ({
        ...prev,
        [field]: cleanValue,
      }));
    }
  };

  // Add this helper function to generate offer details text
  const generateOfferDetailsText = (content) => {
    return `The position we are offering is <strong>${content.position}</strong> with a monthly salary of <strong>${content.salary}</strong> + <strong>${content.incentive}</strong> incentive. You will be reporting to <strong>${content.supervisor}</strong>, and your working hours will be <strong>${content.workingHours}</strong>, from <strong>${content.startDay}</strong> to <strong>${content.endDay}</strong>.`;
  };


  

  // Add this useEffect for debugging
  useEffect(() => {
    setEditableContent((prev) => ({
      ...prev,
      companyName: establishmentData?.name,
      address: establishmentData?.address,
      email: establishmentData?.email,
      phone: establishmentData?.phone,
      employeeName: userData?.full_Name,
    }));
  }, [establishmentData]);

  // Add contentEditable configuration
  const contentEditableConfig = {
    tagName: "div",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onPaste: (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    },
  };

  // Update the useEffect where we set initial content
  useEffect(() => {
    if (editableContent) {
      // Generate initial texts
      const offerText = `The position we are offering is ${editableContent.position} with a monthly salary of ${editableContent.salary} + ${editableContent.incentive} incentive. You will be reporting to ${editableContent.supervisor}, and your working hours will be ${editableContent.workingHours}, from ${editableContent.startDay} to ${editableContent.endDay}.`;
      
      const joiningText = `We would like you to start work on ${editableContent.joiningDate} at ${editableContent.joiningTime}. Please report to ${editableContent.reportingPerson} for documentation and orientation. If this date is not acceptable, please contact us immediately.`;
      
      const acceptanceText = `Please sign the enclosed copy of this letter and return it by ${editableContent.acceptanceDate} to indicate your acceptance of this offer.`;

      setOfferDetailsText(offerText);
      setJoiningInstructionsText(joiningText);
      setAcceptanceInstructionsText(acceptanceText);
    }
  }, [editableContent]);

  // Add this function to handle auto-resize
  const autoResize = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = textarea.scrollHeight + "px"; // Set new height
  };

  const handleSendOfferLetter = async () => {
    try {
        const offerLetterData = {
            establishmentId: establishmentData._id,
            userId: userData._id,
            hiredId: userData.hired._id,
            hiringId: userData.hired.hiring_id,
            letterContent: {
          header: {
            companyName: sanitizeHtml(establishmentData.name || ""),
            address: sanitizeHtml(establishmentData.address || ""),
            email: sanitizeHtml(establishmentData.email || ""),
            phone: sanitizeHtml(establishmentData.phone || ""),
          },
          title: "Offer Letter",
          content: editableContent.fullContent,
          signatures: {
            company: {
              title: `FOR ${sanitizeHtml(establishmentData.name || "")}`,
              designation: "Authorized Signatory",
            },
            employee: {
              name: sanitizeHtml(userData.full_Name || ""),
              designation: "Receiving Signature",
            },
          },
        },
        documentStyle: {
            logoPosition: logoPosition,
            logoSize: logoSize,
            signaturePosition: signaturePosition,
          signatureSize: signatureSize,
        },
        assets: {
            logo: establishmentData.logo,
          signature: establishmentData.signature,
        },
        status: "sent",
    };

      

        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/offer-letter/send`,
            offerLetterData,
            {
                headers: { 
                    Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
            }
        );

        if (response.data.success) {
        toast.success("Offer letter sent successfully!");
        }
    } catch (error) {
      console.error("Error sending offer letter:", error);
      toast.error(
        error.response?.data?.message || "Failed to send offer letter"
      );
    }
};

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  const styles = `
    .editable-field {
      min-width: 50px;
      display: inline-block;
      padding: 2px 4px;
      border: 1px solid transparent;
      transition: all 0.3s ease;
      border-radius: 4px;
    }

    .editable-field:hover:not([contenteditable="false"]) {
      border-color: #dee2e6;
      background-color: rgba(0,0,0,0.02);
    }

    .editable-field:focus {
      outline: none;
      border-color: #007bff;
      background-color: #fff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }

    .editable-field[contenteditable="false"] {
      background-color: #f8f9fa;
      cursor: default;
    }

    .editable-field.inline {
      display: inline;
    }
  `;

  return (
    <div className="container mt-4">
      {/* Action Buttons and Notification at the top */}
      <div
        className="action-buttons mb-4"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {!isAccepted && (
          <button 
            className="btn btn-primary"
            onClick={handleSendOfferLetter}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Send Offer Letter
          </button>
        )}
        {isAccepted && (
          <div className="alert alert-success" role="alert">
            This offer letter has been accepted by the employee
          </div>
        )}
      </div>

      <div className="page-wrapper">
        <div 
          ref={pageRef} 
          className="offer-letter"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            width: '210mm',
            height: '297mm',
            objectFit: 'contain'
          }}
        >
        <div className="header d-flex justify-content-between align-items-start mb-0">
            {establishmentData?.logo && !logoError && (
            <Rnd
              size={{ width: logoSize.width, height: logoSize.height }}
              position={{ x: logoPosition.x-5, y: logoPosition.y-5 }}
                onDragStop={(e, d) => {
                  setLogoPosition({ x: d.x, y: d.y });
                }}
                onResize={(e, direction, ref, delta, position) => {
                  setLogoSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  });
                setLogoPosition(position);
              }}
              bounds="parent"
                minWidth={50}
              minHeight={50}
                maxWidth={300}
                maxHeight={200}
                dragGrid={[5, 5]}
                resizeGrid={[5, 5]}
                style={{
                  background: "transparent",
                }}
                disableDragging={isAccepted}
                enableResizing={!isAccepted}
              >
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}${establishmentData.logo}`}
                  alt="Company Logo" 
                  className="logo" 
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    pointerEvents: "none",
                  }}
                  onError={(e) => {
                    console.error("Error loading logo, trying alternative URL");
                    e.target.src = `${process.env.REACT_APP_BACKEND_URL}${establishmentData.logo}`;
                  }}
                />
            </Rnd>
          )}
            <div
              className={`company-details ${
                !establishmentData?.logo || logoError ? "w-100" : ""
              }`}
              style={{
                width: "97%",
              }}
            >
              <h5 className="company-name text-end">
                {editableContent.companyName}
              </h5>
              <div
                className="text-end"
                style={{ marginBottom: "0rem", paddingBottom: "0.2rem" }}
              >
                {editableContent.address}
              </div>
              <div
                className="contact-info text-end"
                style={{ marginTop: "0rem", paddingTop: "0.2rem" }}
              >
                {editableContent.email}
                <span className="mx-1">,</span>
                {editableContent.phone}
              </div>
          </div>
        </div>

        <hr />

        {/* <br /> */}
          <h4 className="text-center fw-bold m-0">
            <EditableField
              content="Offer Letter"
              onChange={(value) =>
                !isAccepted && handleContentChange("title", value)
              }
              className="text-center"
              dataField="title"
              readOnly={isAccepted}
            />
          </h4>
        <br />

        <div className="d-flex justify-content-between">
          <div>
              <EditableField
                content={editableContent.employeeName}
                onChange={(value) =>
                  !isAccepted && handleContentChange("employeeName", value)
                }
                className="fw-bold"
                dataField="employeeName"
                readOnly={isAccepted}
              />
          </div>
          <div>
              <strong>Date: </strong>
              <EditableField
              className="p-0 -mt-2"
                content={editableContent.joiningDate}
                onChange={(value) =>
                  !isAccepted && handleContentChange("joiningDate", value)
                }
                dataField="joiningDate"
                isInline={true}
                readOnly={isAccepted}
              />
            </div>
          </div>

          <div className="offer-content mb-4">
            <textarea
              className="form-control"
              value={editableContent.fullContent}
              onChange={(e) => {
                if (!isAccepted) {
                  const newValue = e.target.value;
                  handleContentChange("fullContent", newValue);
                  autoResize(e);
                }
              }}
              onInput={autoResize}
              style={{
                minHeight: "500px",
                width: "100%",
                padding: "15px",
                marginBottom: "1rem",
                fontSize: "14px",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap",
                resize: "none",
                overflow: "hidden",
                fontFamily: "inherit",
                backgroundColor: isAccepted ? "#f8f9fa" : "white",
                cursor: isAccepted ? "not-allowed" : "text",
              }}
              readOnly={isAccepted}
            />
          </div>

          <h6>
            <EditableField
              content="Sincerely,"
              onChange={(value) => handleContentChange("closing", value)}
              dataField="closing"
            />
          </h6>

        <div className="d-flex justify-content-between align-items-end">
          <div className="signature-section">
            <EditableField
              content={`FOR ${editableContent.companyName}`}
                onChange={(value) =>
                  handleContentChange("companySignatureTitle", value)
                }
              className="fw-bold"
              dataField="companySignatureTitle"
            />
            <div className="signature-container">
              {establishmentData?.signature && !signatureError && (
                <Rnd
                    size={{
                      width: signatureSize.width,
                      height: signatureSize.height,
                    }}
                  position={signaturePosition}
                  onDragStop={(e, d) => {
                    setSignaturePosition({ x: d.x, y: d.y });
                  }}
                  onResize={(e, direction, ref, delta, position) => {
                    setSignatureSize({
                      width: ref.offsetWidth,
                        height: ref.offsetHeight,
                    });
                    setSignaturePosition(position);
                  }}
                  bounds="parent"
                  minWidth={50}
                  minHeight={30}
                  maxWidth={200}
                  maxHeight={100}
                  dragGrid={[5, 5]}
                  resizeGrid={[5, 5]}
                  style={{
                      position: "absolute",
                      background: "transparent",
                      zIndex: 1000,
                  }}
                  disableDragging={isAccepted}
                  enableResizing={!isAccepted}
                >
                  <img 
                    src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${establishmentData.signature}`}
                    alt="Authorized Signature" 
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        pointerEvents: "none",
                    }}
                    onError={(e) => {
                      setSignatureError(true);
                    }}
                  />
                </Rnd>
              )}
            </div>
            <div className="signature-line">
              <EditableField
                content="Authorized Signatory"
                  onChange={(value) =>
                    handleContentChange("authorizedSignatory", value)
                  }
                className="text-center"
                dataField="authorizedSignatory"
                style={{ 
                    display: "block",
                    width: "200px",
                    borderTop: "1px solid #000",
                    paddingTop: "5px",
                    textAlign: "center",
                }}
              />
            </div>
          </div>
          <div className="receiving-signature">
            <EditableField
              content={editableContent.employeeName}
                onChange={(value) => handleContentChange("employeeName", value)}
              className="fw-bold"
              dataField="employeeSignatureName"
            />
              <div style={{ marginTop: "100px", position: "relative" }}>
              {isAccepted && userSignature && (
                  <div
                    style={{
                      position: "absolute",
                      left: userSignaturePosition?.x - 170 || "50%",
                      top: userSignaturePosition?.y - 80 || "0",
                      transform: "translate(-50%, -100%)",
                      width: "150px",
                      marginBottom: "20px",
                    }}
                  >
                  <img 
                    src={`${process.env.REACT_APP_BACKEND_URL}${userSignature}`}
                    alt="Employee Signature"
                    style={{
                        width: "100%",
                        objectFit: "contain",
                    }}
                  />
                </div>
              )}
              <EditableField
                content="Receiving Signature"
                  onChange={(value) =>
                    handleContentChange("receivingSignature", value)
                  }
                className="text-center"
                dataField="receivingSignature"
                style={{ 
                    display: "block",
                    borderTop: "1px solid #000",
                    paddingTop: "5px",
                    marginTop: isAccepted ? "20px" : "0",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
      <ZoomControls />
      <style jsx>{styles}</style>
    </div>
  );
};

export default OfferLetter;
