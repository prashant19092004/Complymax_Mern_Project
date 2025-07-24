import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { getToken } from '../../../utils/tokenService';

const OfferLetter = () => {
  const [offerLetters, setOfferLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfferLetters = async () => {
      const token = await getToken();
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/offer-letter/user/offer-letters`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOfferLetters(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching offer letters:', error);
        setLoading(false);
      }
    };

    fetchOfferLetters();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      case 'sent':
        return 'bg-info';
      case 'draft':
        return 'bg-secondary';
      default:
        return 'bg-warning';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'sent':
        return 'Sent';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading offer letters...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white border-bottom-0">
          <h3 className="mb-0">My Offer Letters</h3>
        </div>
        <div className="card-body">
          {offerLetters.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No offer letters found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {offerLetters.map((offer) => (
                    <tr key={offer._id}>
                      <td data-label="Position">{offer.hiringId.job_category}</td>
                      <td data-label="Company">{offer.establishmentId.name}</td>
                      <td data-label="Status" style={{height: '45px'}}>
                        {/* <div > */}
                          <div className={`badge ${getStatusBadgeClass(offer.status)}`}>
                            {getStatusText(offer.status)}
                          </div>
                        {/* </div> */}
                      </td>
                      <td data-label="Date">
                        {offer.acceptanceDate 
                          ? new Date(offer.acceptanceDate).toLocaleDateString()
                          : new Date(offer.createdAt).toLocaleDateString()}
                      </td>
                      <td data-label="Action">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/user_dashboard/offer-letter/${offer._id}`)}
                          style={{marginTop: '1.5rem'}}
                        >
                          <FaEye className="me-1" />
                          Show
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferLetter;