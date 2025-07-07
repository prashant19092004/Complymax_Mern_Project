import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdEdit, MdLocationOn, MdEmail, MdPhone, MdBusiness } from "react-icons/md";
import { FaBuilding, FaSignature } from "react-icons/fa";
import default_pic from '../../../assets/Default_pfp.svg.png';
import './Profile.css';
import { Modal, Form, Button } from 'react-bootstrap';

const Profile = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const profile_pic_input_ref = useRef();
  const [file, setFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    registration_number: '',
    gst_number: ''
  });
  const logo_input_ref = useRef();
  const [logoFile, setLogoFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);

  async function fetchingProfile() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch profile data');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchingProfile();
  }, []);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is PDF
      if (selectedFile.type === 'application/pdf') {
        toast.warning('Please upload profile picture in JPG or PNG format only');
        e.target.value = ''; // Clear the file input
        return;
      }
      setFile(selectedFile);
      onSubmit(selectedFile);
    }
  };

  const onSubmit = async (selectedFile) => {
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/upload-profile-pic`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (res.data.success) {
        toast.success('Profile picture updated successfully!');
        setUser(prev => ({
          ...prev,
          profilePic: res.data.establishment.profilePic
        }));
      } else {
        throw new Error(res.data.message || 'Failed to update profile picture');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to update profile picture');
    }
  };

  const handleProfilePicClick = () => {
    profile_pic_input_ref.current.click();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/update-profile`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setUser(response.data.establishment);
        toast.success('Profile updated successfully!');
        setShowEditModal(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleEditClick = () => {
    setEditData({
      name: user.name || '',
      email: user.email || '',
      contact: user.contact || '',
      address: user.address || '',
      registration_number: user.registration_number || '',
      gst_number: user.gst_number || ''
    });
    setShowEditModal(true);
  };

  const handleLogoUpload = async (selectedFile) => {
    const formData = new FormData();
    formData.append('logo', selectedFile);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/upload-logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (res.data.success) {
        toast.success('Logo updated successfully!');
        setUser(prev => ({
          ...prev,
          logo: res.data.establishment.logo
        }));
      } else {
        throw new Error(res.data.message || 'Failed to update logo');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to update logo');
    }
  };

  const onLogoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is PDF
      if (selectedFile.type === 'application/pdf') {
        toast.warning('Please upload logo in JPG or PNG format only');
        e.target.value = ''; // Clear the file input
        return;
      }
      setLogoFile(selectedFile);
      handleLogoUpload(selectedFile);
    }
  };

  const handleSignatureUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is PDF
      if (file.type === 'application/pdf') {
        toast.warning('Please upload signature in JPG or PNG format only');
        e.target.value = ''; // Clear the file input
        return;
      }

      const formData = new FormData();
      formData.append('signature', file);

      try {
        console.log('Uploading signature:', file);

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/establishment/upload-signature`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Upload response:', response.data);

        if (response.data.success) {
          toast.success('Signature uploaded successfully');
          setUser(prev => ({
            ...prev,
            signature: response.data.signature
          }));
        } else {
          throw new Error(response.data.message || 'Failed to upload signature');
        }
      } catch (error) {
        console.error('Error details:', error.response || error);
        toast.error(
          error.response?.data?.message || 
          error.message || 
          'Failed to upload signature'
        );
      } finally {
        e.target.value = '';
      }
    }
  };

  const handleDeleteSignature = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/delete-signature`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success('Signature deleted successfully');
        setSignaturePreview(null);
        setSignature(null);
        setUser(prev => ({
          ...prev,
          signature: null
        }));
      } else {
        throw new Error(res.data.message || 'Failed to remove signature');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.message || 'Failed to remove signature');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-cover-image"></div>
        <div className="profile-avatar-section">
          <div className="avatar-container">
            <img 
              className="avatar-image"
              src={user.profilePic ? `${process.env.REACT_APP_BACKEND_URL}${user.profilePic}` : default_pic} 
              alt="Profile" 
            />
            <button 
              className="avatar-edit-button"
              onClick={handleProfilePicClick}
            >
              <MdEdit />
            </button>
          </div>
          <div className="profile-title">
            <div className="d-flex align-items-center gap-3">
              <h1>{user.name}</h1>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={handleEditClick}
              >
                <MdEdit /> Edit Profile
              </button>
            </div>
            <p>Establishment</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Contact Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <MdEmail className="info-icon" />
              <div>
                <h3>Email</h3>
                <p>{user.email}</p>
              </div>
            </div>
            <div className="info-item">
              <MdPhone className="info-icon" />
              <div>
                <h3>Phone</h3>
                <p>{user.contact || 'Not provided'}</p>
              </div>
            </div>
            <div className="info-item">
              <MdLocationOn className="info-icon" />
              <div>
                <h3>Address</h3>
                <p>{user.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Business Information</h2>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={handleEditClick}
            >
              <MdEdit /> Edit
            </button>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <FaBuilding className="info-icon" />
              <div>
                <h3>Registration Number</h3>
                <p>{user.registration_number || 'Not provided'}</p>
              </div>
            </div>
            <div className="info-item">
              <MdBusiness className="info-icon" />
              <div>
                <h3>GST Number</h3>
                <p>{user.gst_number || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Clients</h3>
              <p>{user.clients?.length || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Active Hirings</h3>
              <p>{user.hirings?.length || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Supervisors</h3>
              <p>{user.supervisors?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Company Logo</h2>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => logo_input_ref.current.click()}
            >
              <MdEdit /> {user.logo ? 'Change Logo' : 'Upload Logo'}
            </button>
          </div>
          <div className="logo-container">
            {user.logo ? (
              <div className="current-logo">
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}${user.logo}`}
                  alt="Company Logo"
                  className="company-logo"
                />
                <button 
                  className="btn btn-outline-danger btn-sm mt-2"
                  onClick={async () => {
                    try {
                      const res = await axios.post(
                        `${process.env.REACT_APP_BACKEND_URL}/api/establishment/delete-logo`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      if (res.data.success) {
                        setUser(prev => ({ ...prev, logo: null }));
                        toast.success('Logo removed successfully');
                      }
                    } catch (err) {
                      toast.error('Failed to remove logo');
                    }
                  }}
                >
                  Remove Logo
                </button>
              </div>
            ) : (
              <div className="logo-placeholder">
                <p>No logo uploaded</p>
                <small>Click 'Upload Logo' to add your company logo</small>
              </div>
            )}
          </div>
          <input 
            ref={logo_input_ref}
            type="file"
            onChange={onLogoChange}
            accept="image/jpeg,image/png,image/jpg"
            className="hidden-input"
          />
        </div>

        <div className="profile-section">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Company Signature</h2>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => document.getElementById('signature-upload').click()}
            >
              <MdEdit /> {user.signature ? 'Change Signature' : 'Upload Signature'}
            </button>
          </div>
          <div className="signature-container">
            {user.signature ? (
              <div className="current-signature">
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${user.signature}`}
                  alt="Company Signature"
                  className="company-signature"
                />
                <button 
                  className="btn btn-outline-danger btn-sm mt-2"
                  onClick={handleDeleteSignature}
                >
                  Remove Signature
                </button>
              </div>
            ) : (
              <div className="signature-placeholder">
                <p>No signature uploaded</p>
                <small>Click 'Upload Signature' to add your signature</small>
              </div>
            )}
          </div>
          <input 
            id="signature-upload"
            type="file"
            onChange={handleSignatureUpload}
            accept="image/jpeg,image/png,image/jpg"
            className="hidden-input"
          />
        </div>
      </div>

      <input 
        ref={profile_pic_input_ref}
        type="file"
        onChange={onFileChange}
        accept="image/jpeg,image/png,image/jpg"
        className="hidden-input"
      />

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({...editData, email: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                value={editData.contact}
                onChange={(e) => setEditData({...editData, contact: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Registration Number</Form.Label>
              <Form.Control
                type="text"
                value={editData.registration_number}
                onChange={(e) => setEditData({...editData, registration_number: e.target.value})}
                placeholder="Enter registration number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>GST Number</Form.Label>
              <Form.Control
                type="text"
                value={editData.gst_number}
                onChange={(e) => setEditData({...editData, gst_number: e.target.value})}
                placeholder="Enter GST number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editData.address}
                onChange={(e) => setEditData({...editData, address: e.target.value})}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;