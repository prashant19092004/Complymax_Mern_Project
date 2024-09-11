import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:9000/api/establisment/reset-password', { email });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleForgotPassword}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Send Reset Link</button>
    </form>
  );
};

export default ForgotPassword;
