import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Extract the token from the URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if(newPassword === confirmPassword){
      try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/establisment/reset-password/${token}`, { newPassword }); 
        if(res.status===200){
          alert(res.data.message);
          navigate('/');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  function addfocus(e){
    let parent = e.target.parentNode.parentNode;
    parent.classList.add("focus")
  }

/*=== Remove focus ===*/
function remfocus(e){
    let parent = e.target.parentNode.parentNode
    if(e.target.value == ""){
        parent.classList.remove("focus")
    }
}

  return (
    <div class="l-form">
            <div class="shape1"></div>
            <div class="shape2"></div>

            <div class="form">
                {/* <img src={login_pic} alt="" class="form__img" /> */}

                <form action="" onSubmit={handleResetPassword} class="form__content">
                    <h1 class="form__title">Reset Password</h1>

                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            <i class='bx bx-user-circle'></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">New Password</label>
                            <input 
                            type="password" 
                            name='newPassword' 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                            value={newPassword} 
                            id='newPassword' 
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                    </div>
                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            <i class='bx bx-user-circle'></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Confirm New Password</label>
                            <input 
                            type="password" 
                            name='confirmPassword' 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            value={confirmPassword} 
                            id='email' 
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                    </div>

                    <input type="submit" class="form__button" value="Reset Password" />

                </form>
            </div>

        </div>
  );
};

export default ResetPassword;
