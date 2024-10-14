import React, { useState } from 'react'
import './../UserSignup.css';
import otp_icon from '../../../assets/otp.png';

const OtpForm = (props) => {

  const [userOtp, setUserOtp] = useState("");

  function otpChangeHandler(e) {
    setUserOtp(e.target.value);
    // console.log(userOtp);
  }

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
    // <div>
    //     <div>
    //         <label className="otpForm-btn block text-sm font-bold mb-2">
    //                             OTP
    //                             </label>
    //         <input onChange={otpChangeHandler} className='shadow apperance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' maxLength="6" required id='otp' type='text' placeholder='Enter OTP'/>
    //     </div>
    //     <div onClick={() => props.VerifyOtp(userOtp)} className='flex justify-center items-center text-gray-50 bg-blue-400 rounded-lg hover:bg-blue-300 w-full py-3 my-3'>Verify</div>
    // </div>
    <div>
     <div class="form__div">
                        <div class="form__icon">
                            <i class='bx bx-lock' ></i>
                            {/* <img src={otp_icon} alt='' /> */}
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">OTP</label>
                            <input type="text" onChange={otpChangeHandler} maxLength="6" required id='otp' class="form__input" onFocus={addfocus} onBlur={remfocus} />
                        </div>
                    </div> 
                    <input type="submit" onClick={(e) => props.VerifyOtp(e, userOtp)} class="form__button" value="Verify" />
  </div>
  )
}

export default OtpForm