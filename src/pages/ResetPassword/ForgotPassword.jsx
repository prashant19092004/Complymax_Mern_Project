import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../component1/widgets/Loading';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/establisment/reset-password`, { email });
      if(res.status===200){
        toast.success(res.data.message);
        setLoading(false);
        navigate('/user_login');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message)
      setLoading(false);
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

                <form action="" onSubmit={handleForgotPassword} class="form__content">
                    <h1 class="form__title">Welcome</h1>

                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            <i class='bx bx-user-circle'></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Email</label>
                            <input 
                            type="email" 
                            name='email' 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            value={email} 
                            id='email' 
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                    </div>

                    <button type="submit" class="form__button position-relative">{loading ? <span className=''><Loading width="30px" height="30px" /></span> : 'Send Reset Link'}</button>
                    
                </form>

            </div>

        </div>
  );
};

export default ForgotPassword;
