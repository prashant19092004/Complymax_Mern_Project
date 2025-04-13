import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Rnd } from "react-rnd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OfferLetter.css"; // Custom styling
import EditableField from "./EditableField";

const calculateScale = () => {
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const mmToPx = 3.779527559; // Convert mm to pixels
  
  const pageWidthPx = pageWidth * mmToPx;
  const pageHeightPx = pageHeight * mmToPx;
  
  // Get the available space (accounting for padding)
  const availableWidth = window.innerWidth - 40;
  const availableHeight = window.innerHeight - 40;
  
  // Calculate scales for both dimensions
  const scaleX = availableWidth / pageWidthPx;
  const scaleY = availableHeight / pageHeightPx;
  
  // Use the smaller scale to ensure everything fits
  return Math.min(scaleX, scaleY, 1);
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

  const [signatureSize, setSignatureSize] = useState({ width: 150, height: 80 });
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });
  const [signatureError, setSignatureError] = useState(false);

  const pageRef = useRef(null);

  const [scale, setScale] = useState(calculateScale());

  const [editableContent, setEditableContent] = useState({
    companyName: '',
    address: '',
    email: '',
    phone: '',
    employeeName: '',
    employeeAddress: '',
    position: "Delivery Associate",
    salary: "Rs-19000/-",
    incentive: "2000",
    supervisor: "Sushant Gupta",
    workingHours: "9AM to 6PM",
    startDay: "Monday",
    endDay: "Saturday",
    joiningDate: "10-03-2025",
    joiningTime: "5:00 AM",
    reportingPerson: "Yogesh Kumar Sharma",
    acceptanceDate: "11-03-2025"
  });

  console.log(userData);

  useEffect(() => {
    const handleResize = () => {
      setScale(calculateScale());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ZoomControls = () => (
    <div className="zoom-controls">
      <button 
        onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
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
        onClick={() => setScale(1)}
        title="Reset zoom"
        style={{ fontSize: '14px', width: 'auto', padding: '0 10px' }}
      >
        Reset
      </button>
    </div>
  );

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
          )
        ]);

        setUserData(userResponse.data.employee);
        
        // Make sure we're getting the correct data structure
        const establishmentInfo = establishmentResponse.data.data;
        console.log('Full Establishment Response:', establishmentResponse.data);
        console.log('Establishment Info:', establishmentInfo);
        
        // Update establishment data
        setEstablishmentData({
          ...establishmentInfo,
          logo: establishmentInfo.logo || null,
          signature: establishmentInfo.signature || null
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Failed to fetch required data");
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) fetchData();
  }, [employeeId, token]);

  useEffect(() => {
    if (establishmentData?.logo) {
      console.log('Logo URL from backend:', establishmentData.logo);
      
      // Test both possible URL formats
      const directUrl = establishmentData.logo;
      const constructedUrl = `${process.env.REACT_APP_BACKEND_URL}${establishmentData.logo}`;
      
      console.log('Testing URLs:', {
        directUrl,
        constructedUrl
      });

      const img = new Image();
      img.onload = () => {
        console.log('Logo loaded successfully');
        setLogoError(false);
      };
      
      img.onerror = () => {
        console.error('Direct URL failed, trying constructed URL');
        img.src = constructedUrl;
      };
      
      img.src = directUrl;
    }
  }, [establishmentData]);

  const handleContentChange = (field, value) => {
    // Clean the value before updating state
    const cleanValue = value
      .replace(/\n/g, '') // Remove line breaks
      .replace(/<br>/g, '') // Remove <br> tags
      .replace(/<div>/g, '') // Remove <div> tags
      .replace(/<\/div>/g, '') // Remove closing </div> tags
      .trim(); // Remove extra whitespace

    setEditableContent(prev => {
      const newContent = {
        ...prev,
        [field]: cleanValue
      };
      return newContent;
    });
  };

  const sanitizeHtml = (html) => {
    // Only allow <strong> and <br> tags
    return html.replace(/<(?!\/?(strong|br)[^>]*>)[^>]+>/g, '');
  };

  useEffect(() => {
    if (establishmentData && userData) {
      setEditableContent(prev => ({
        ...prev,
        companyName: sanitizeHtml(establishmentData.name || ''),
        address: sanitizeHtml(establishmentData.address || ''),
        email: sanitizeHtml(establishmentData.email || ''),
        phone: sanitizeHtml(establishmentData.phone || ''),
        employeeName: sanitizeHtml(userData.full_Name || ''),
        employeeAddress: sanitizeHtml(userData.address || '')
      }));
    }
  }, [establishmentData, userData]);

  useEffect(() => {
    if (establishmentData?.signature) {
      console.log('Signature URL from backend:', establishmentData.signature);
      
      const directUrl = establishmentData.signature;
      const constructedUrl = `${process.env.REACT_APP_BACKEND_URL}/uploads/${establishmentData.signature}`;
      
      console.log('Testing signature URLs:', {
        directUrl,
        constructedUrl
      });

      const img = new Image();
      img.onload = () => {
        console.log('Signature loaded successfully');
        setSignatureError(false);
      };
      
      img.onerror = () => {
        console.error('Direct URL failed, trying constructed URL');
        img.src = constructedUrl;
      };
      
      img.src = directUrl;
    }
  }, [establishmentData]);

  // Add this useEffect for debugging
  useEffect(() => {
    if (establishmentData) {
      console.log('Updated Establishment Data:', establishmentData);
      console.log('Logo URL:', establishmentData.logo);
      console.log('Signature URL:', establishmentData.signature);
    }
  }, [establishmentData]);

  // Add contentEditable configuration
  const contentEditableConfig = {
    tagName: 'div',
    contentEditable: true,
    suppressContentEditableWarning: true,
    onPaste: (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    }
  };

  const handleSendOfferLetter = async () => {
    try {
      // Get all editable content from the screen
      const editableElements = document.querySelectorAll('.editable-field');
      const screenContent = {};
      
      editableElements.forEach(element => {
        const fieldName = element.getAttribute('data-field');
        if (fieldName) {
          // Clean the content before storing it
          const content = element.innerHTML
            .replace(/\n/g, '')
            .replace(/<br>/g, '')
            .replace(/<div>/g, '')
            .replace(/<\/div>/g, '')
            .trim();
          screenContent[fieldName] = content;
        }
      });

      // Get all text content from the offer letter
      const offerLetterContent = {
        header: {
          companyName: screenContent.companyName || editableContent.companyName,
          address: screenContent.address || editableContent.address,
          email: screenContent.email || editableContent.email,
          phone: screenContent.phone || editableContent.phone
        },
        title: "Offer Letter",
        recipient: {
          name: screenContent.employeeName || editableContent.employeeName,
          address: screenContent.employeeAddress || editableContent.employeeAddress,
          date: screenContent.joiningDate || editableContent.joiningDate
        },
        salutation: `Dear ${screenContent.employeeName || editableContent.employeeName},`,
        congratulations: `Congratulations! We are pleased to confirm that you have been selected to work for <strong>${screenContent.companyName || editableContent.companyName}</strong>. We are delighted to offer you the following job.`,
        offerDetails: screenContent.offerDetails || `The position we are offering is <strong>${editableContent.position}</strong> with a monthly salary of <strong>${editableContent.salary}</strong> + <strong>${editableContent.incentive}</strong> incentive. You will be reporting to <strong>${editableContent.supervisor}</strong>, and your working hours will be <strong>${editableContent.workingHours}</strong>, from <strong>${editableContent.startDay}</strong> to <strong>${editableContent.endDay}</strong>.`,
        benefits: ["Employer State Insurance Corporation (ESIC) Coverage"],
        joiningInstructions: screenContent.joiningInstructions || `We would like you to start work on <strong>${editableContent.joiningDate}</strong> at <strong>${editableContent.joiningTime}</strong>. Please report to <strong>${editableContent.reportingPerson}</strong> for documentation and orientation. If this date is not acceptable, please contact us immediately.`,
        acceptanceInstructions: screenContent.acceptanceInstructions || `Please sign the enclosed copy of this letter and return it by <strong>${editableContent.acceptanceDate}</strong> to indicate your acceptance of this offer.`,
        closingMessage: `We are confident that you will make a significant contribution to the success of ${screenContent.companyName || editableContent.companyName} and look forward to working with you.`,
        signatures: {
          company: {
            title: `FOR ${screenContent.companyName || editableContent.companyName}`,
            designation: "Authorized Signatory"
          },
          employee: {
            name: screenContent.employeeName || editableContent.employeeName,
            designation: "Receiving Signature"
          }
        }
      };

        const offerLetterData = {
            establishmentId: establishmentData._id,
            userId: userData._id,
            hiredId: userData.hired._id,
            hiringId: userData.hired.hiring_id,
        letterContent: offerLetterContent,
            documentStyle: {
                logoPosition: logoPosition,
                logoSize: logoSize,
                signaturePosition: signaturePosition,
                signatureSize: signatureSize
            },
            assets: {
                logo: establishmentData.logo,
                signature: establishmentData.signature
            },
            status: 'sent'
        };

      console.log('Sending offer letter data:', JSON.stringify(offerLetterData, null, 2));

        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/offer-letter/send`,
            offerLetterData,
            {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.success) {
            toast.success('Offer letter sent successfully!');
        }
    } catch (error) {
        console.error('Error sending offer letter:', error);
        toast.error(error.response?.data?.message || 'Failed to send offer letter');
    }
};

  console.log(establishmentData);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="page-wrapper">
        <div 
          ref={pageRef} 
          className="offer-letter"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
        <div className="header d-flex justify-content-between align-items-start">
            {establishmentData?.logo && !logoError && (
            <Rnd
              size={{ width: logoSize.width, height: logoSize.height }}
              position={{ x: logoPosition.x, y: logoPosition.y }}
                onDragStop={(e, d) => {
                  setLogoPosition({ x: d.x, y: d.y });
                }}
                onResize={(e, direction, ref, delta, position) => {
                  setLogoSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight
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
                  background: 'transparent'
                }}
              >
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}${establishmentData.logo}`}
                  alt="Company Logo" 
                  className="logo" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none'
                  }}
                  onError={(e) => {
                    console.error('Error loading logo, trying alternative URL');
                    e.target.src = `${process.env.REACT_APP_BACKEND_URL}${establishmentData.logo}`;
                  }}
                />
            </Rnd>
          )}
            <div className={`company-details ${!establishmentData?.logo || logoError ? 'w-100' : ''}`}>
              <h5 className="company-name text-end">
                {editableContent.companyName}
              </h5>
          <div className="text-end" style={{ marginBottom: '0rem', paddingBottom: '0.2rem' }}>
                {editableContent.address}
              </div>
              <div className="contact-info text-end" style={{ marginTop: '0rem', paddingTop: '0.2rem' }}>
                {editableContent.email}
                <span className="mx-1">,</span>
                {editableContent.phone}
              </div>
          </div>
        </div>

        <hr />

        <br />
          <h4 className="text-center fw-bold">
            <EditableField
              content="Offer Letter"
              onChange={(value) => handleContentChange('title', value)}
              className="text-center"
              dataField="title"
            />
          </h4>
        <br />

        <div className="d-flex justify-content-between">
          <div>
              <EditableField
                content={editableContent.employeeName}
                onChange={(value) => handleContentChange('employeeName', value)}
                className="fw-bold"
                dataField="employeeName"
              />
              <EditableField
                content={editableContent.employeeAddress}
                onChange={(value) => handleContentChange('employeeAddress', value)}
                dataField="employeeAddress"
              />
          </div>
          <div>
              <strong>Date: </strong>
              <EditableField
                content={editableContent.joiningDate}
                onChange={(value) => handleContentChange('joiningDate', value)}
                dataField="joiningDate"
                isInline={true}
              />
            </div>
          </div>

          <p>
            Dear <EditableField
              content={editableContent.employeeName}
              onChange={(value) => handleContentChange('employeeName', value)}
              dataField="employeeName"
              isInline={true}
            />,
          </p>

          <EditableField
            content={`Congratulations! We are pleased to confirm that you have been selected to work for <strong>${editableContent.companyName}</strong>. We are delighted to offer you the following job.`}
            onChange={(value) => handleContentChange('congratulations', value)}
            dataField="congratulations"
          />

          <div className="offer-details" style={{ 
            margin: '10px 0',
            padding: '5px',
            border: '1px solid transparent',
            transition: 'border-color 0.3s'
          }}>
          </div>

          <EditableField
            content={`The position we are offering is <strong>${editableContent.position}</strong> with a monthly salary of <strong>${editableContent.salary}</strong> + <strong>${editableContent.incentive}</strong> incentive. You will be reporting to <strong>${editableContent.supervisor}</strong>, and your working hours will be <strong>${editableContent.workingHours}</strong>, from <strong>${editableContent.startDay}</strong> to <strong>${editableContent.endDay}</strong>.`}
            onChange={(value) => {
              // Extract values from the HTML content
              const positionMatch = value.match(/position we are offering is <strong>(.*?)<\/strong>/);
              const salaryMatch = value.match(/monthly salary of <strong>(.*?)<\/strong>/);
              const incentiveMatch = value.match(/\+ <strong>(.*?)<\/strong> incentive/);
              const supervisorMatch = value.match(/reporting to <strong>(.*?)<\/strong>/);
              const workingHoursMatch = value.match(/working hours will be <strong>(.*?)<\/strong>/);
              const startDayMatch = value.match(/from <strong>(.*?)<\/strong> to/);
              const endDayMatch = value.match(/to <strong>(.*?)<\/strong>\./);

              // Update individual fields
              if (positionMatch) handleContentChange('position', positionMatch[1]);
              if (salaryMatch) handleContentChange('salary', salaryMatch[1]);
              if (incentiveMatch) handleContentChange('incentive', incentiveMatch[1]);
              if (supervisorMatch) handleContentChange('supervisor', supervisorMatch[1]);
              if (workingHoursMatch) handleContentChange('workingHours', workingHoursMatch[1]);
              if (startDayMatch) handleContentChange('startDay', startDayMatch[1]);
              if (endDayMatch) handleContentChange('endDay', endDayMatch[1]);
            }}
            dataField="offerDetails"
            style={{ 
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              minHeight: '2em',
              margin: '10px 0',
              padding: '5px',
              border: '1px dashed #ccc',
              borderRadius: '3px'
            }}
          />

          <h6>
            <EditableField
              content="Benefits for the position include:"
              onChange={(value) => handleContentChange('benefitsTitle', value)}
              dataField="benefitsTitle"
            />
          </h6>
          <ul>
            <li>
              <EditableField
                content="Employer State Insurance Corporation (ESIC) Coverage"
                onChange={(value) => handleContentChange('benefit1', value)}
                dataField="benefit1"
              />
            </li>
        </ul>

          <EditableField
            content={`We would like you to start work on <strong>${editableContent.joiningDate}</strong> at <strong>${editableContent.joiningTime}</strong>. Please report to <strong>${editableContent.reportingPerson}</strong> for documentation and orientation. If this date is not acceptable, please contact us immediately.`}
            onChange={(value) => {
              const joiningDateMatch = value.match(/start work on <strong>(.*?)<\/strong>/);
              const joiningTimeMatch = value.match(/at <strong>(.*?)<\/strong>/);
              const reportingPersonMatch = value.match(/report to <strong>(.*?)<\/strong>/);

              if (joiningDateMatch) handleContentChange('joiningDate', joiningDateMatch[1]);
              if (joiningTimeMatch) handleContentChange('joiningTime', joiningTimeMatch[1]);
              if (reportingPersonMatch) handleContentChange('reportingPerson', reportingPersonMatch[1]);
            }}
            dataField="joiningInstructions"
          />

          <EditableField
            content={`Please sign the enclosed copy of this letter and return it by <strong>${editableContent.acceptanceDate}</strong> to indicate your acceptance of this offer.`}
            onChange={(value) => {
              const acceptanceDateMatch = value.match(/by <strong>(.*?)<\/strong>/);
              if (acceptanceDateMatch) handleContentChange('acceptanceDate', acceptanceDateMatch[1]);
            }}
            dataField="acceptanceInstructions"
          />

          <EditableField
            content={`We are confident that you will make a significant contribution to the success of ${editableContent.companyName} and look forward to working with you.`}
            onChange={(value) => handleContentChange('closingMessage', value)}
            dataField="closingMessage"
          />

          <h6>
            <EditableField
              content="Sincerely,"
              onChange={(value) => handleContentChange('closing', value)}
              dataField="closing"
            />
          </h6>

        <div className="d-flex justify-content-between align-items-end">
          <div className="signature-section">
            <EditableField
              content={`FOR ${editableContent.companyName}`}
              onChange={(value) => handleContentChange('companySignatureTitle', value)}
              className="fw-bold"
              dataField="companySignatureTitle"
            />
            <div className="signature-container">
              {establishmentData?.signature && !signatureError && (
                <Rnd
                  size={{ width: signatureSize.width, height: signatureSize.height }}
                  position={signaturePosition}
                  onDragStop={(e, d) => {
                    setSignaturePosition({ x: d.x, y: d.y });
                  }}
                  onResize={(e, direction, ref, delta, position) => {
                    setSignatureSize({
                      width: ref.offsetWidth,
                      height: ref.offsetHeight
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
                    position: 'absolute',
                    background: 'transparent',
                    zIndex: 1000
                  }}
                >
                  <img 
                    src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${establishmentData.signature}`}
                    alt="Authorized Signature" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      pointerEvents: 'none'
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
                onChange={(value) => handleContentChange('authorizedSignatory', value)}
                className="text-center"
                dataField="authorizedSignatory"
                style={{ 
                  display: 'block', 
                  width: '200px',
                  borderTop: '1px solid #000', 
                  paddingTop: '5px',
                  textAlign: 'center'
                }}
              />
            </div>
          </div>
          <div className="receiving-signature">
            <EditableField
              content={editableContent.employeeName}
              onChange={(value) => handleContentChange('employeeName', value)}
              className="fw-bold"
              dataField="employeeSignatureName"
            />
            <div style={{ marginTop: '100px' }}>
              <EditableField
                content="Receiving Signature"
                onChange={(value) => handleContentChange('receivingSignature', value)}
                className="text-center"
                dataField="receivingSignature"
                style={{ display: 'block', borderTop: '1px solid #000', paddingTop: '5px' }}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
      <ZoomControls />
      <div className="action-buttons" style={{ 
            marginTop: '20px', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '10px' 
        }}>
            <button 
                className="btn btn-primary"
                onClick={handleSendOfferLetter}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    fontWeight: '500'
                }}
            >
                Send Offer Letter
            </button>
        </div>
      <style jsx>{`
        .editable-field {
          min-width: 50px;
          display: inline-block;
          padding: 2px 5px;
          border: 1px solid transparent;
          transition: border-color 0.3s;
        }
        .editable-field:hover {
          border-color: #ddd;
          background: rgba(0,0,0,0.02);
        }
        .editable-field:focus {
          border-color: #007bff;
          outline: none;
          background: #fff;
        }
        .editable-field.inline {
          display: inline;
        }
      `}</style>
    </div>
  );
};

export default OfferLetter;
