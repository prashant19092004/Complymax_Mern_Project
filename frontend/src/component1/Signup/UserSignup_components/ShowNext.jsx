import React from 'react';
import './../UserSignup.css';

const ShowNext = ({ generateOtp, loading }) => {
  return (
    <button
      type="submit"
      className="form__button"
      onClick={generateOtp}
      disabled={loading}
      style={{
        opacity: loading ? 0.6 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      )}
      {loading ? 'Sending OTP...' : 'Generate OTP'}
    </button>
  );
};

export default ShowNext;
