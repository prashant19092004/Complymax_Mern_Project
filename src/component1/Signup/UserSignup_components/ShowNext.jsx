import React from 'react'
import './../UserSignup.css';

const ShowNext = (props) => {
  return (
    // <div className='generate-btn text-center flex justify-center items-center'>
    //     <div onClick={() => props.generateOtp()} className='text-gray-50 bg-blue-400 rounded hover:bg-blue-300 w-full py-2'>Generate Otp</div>
    // </div>
    <input type="submit" class="form__button" value="Generate Otp" onClick={(e) => props.generateOtp(e)} />
  )
}

export default ShowNext