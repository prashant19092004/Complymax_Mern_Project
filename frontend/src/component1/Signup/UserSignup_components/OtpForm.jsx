import React, { useState } from 'react';
import './../UserSignup.css';

const OtpForm = ({ VerifyOtp, loading, resendTimer, resendOtp }) => {
  const [userOtp, setUserOtp] = useState("");

  const otpChangeHandler = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val) && val.length <= 6) {
      setUserOtp(val);
    }
  };

  const addFocus = (e) => {
    e.target.closest(".form__div").classList.add("focus");
  };

  const remFocus = (e) => {
    if (!e.target.value) {
      e.target.closest(".form__div").classList.remove("focus");
    }
  };

  return (
    <div>
      <div className="form__div">
        <div className="form__icon">
          <i className="bx bx-lock"></i>
        </div>

        <div className="form__div-input">
          <label htmlFor="otp" className="form__label">OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="6"
            value={userOtp}
            onChange={otpChangeHandler}
            onFocus={addFocus}
            onBlur={remFocus}
            required
            className="form__input"
            disabled={loading}
          />
        </div>
      </div>

      <button
        onClick={(e) => VerifyOtp(e, userOtp)}
        className="form__button"
        disabled={userOtp.length !== 6 || loading}
        style={{
          opacity: userOtp.length !== 6 || loading ? 0.6 : 1,
          cursor: userOtp.length !== 6 || loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}
      >
        {loading && (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        )}
        {loading ? 'Verifying...' : 'Verify'}
      </button>

      {/* ⏱ Resend OTP */}
      <div style={{ textAlign: 'center', fontSize: '14px' }}>
        {resendTimer > 0 ? (
          <span>Resend OTP in <strong>{resendTimer}s</strong></span>
        ) : (
          <button
            onClick={resendOtp}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0
            }}
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpForm;
