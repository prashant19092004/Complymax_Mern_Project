import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Extract the token from the URL
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:9000/api/establisment/reset-password/${token}`, { newPassword });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleResetPassword}>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;
