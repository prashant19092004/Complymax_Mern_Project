import React, { useState } from 'react'

const DetailForm = (props) => {

    const [userDetail, setUserDetail] = useState({
        name : "",
        contact : "",
        email : "",
        password : "",
        confirm_password : ""
    })

    function changeHandler(e){
        setUserDetail({...userDetail, [e.target.name] : e.target.value});
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
    <div>
                    {/* <div class="form__div form__div-one">
                        <div class="form__icon">
                            <i class='bx bx-user-circle'></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label"></label>
                            <input 
                            onChange={changeHandler}
                            required
                            id="name"
                            type="text" 
                            name="name"
                            disabled
                            // value={props.aadharData.full_name}
                            class="form__input focus" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                    </div> */}

                    

                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            {/* <i class='bx bx-user-circle'></i> */}
                            <i class='bx bx-envelope'></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Email</label>
                            <input 
                            onChange={changeHandler}
                            required
                            id="email"
                            type="email" 
                            name="email"
                            value={userDetail.email}
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
                            <label for="" class="form__label">Contact No.</label>
                            <input 
                            onChange={changeHandler}
                            required
                            id="contact"
                            type="text" 
                            name="contact"
                            value={userDetail.contact}
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                        
                    </div>

                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            <i class='bx bx-lock' ></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Password</label>
                            <input 
                            onChange={changeHandler}
                            required
                            id="password"
                            type="password" 
                            name="password"
                            value={userDetail.password}
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                        
                    </div>

                    <div class="form__div form__div-one">
                        <div class="form__icon">
                            <i class='bx bx-lock' ></i>
                        </div>

                        <div class="form__div-input">
                            <label for="" class="form__label">Confirm Password</label>
                            <input 
                            onChange={changeHandler}
                            required
                            id="confirm_password"
                            type="password" 
                            name="confirm_password"
                            value={userDetail.confirm_password}
                            class="form__input" 
                            onFocus={addfocus} 
                            onBlur={remfocus} />
                        </div>
                        
                    </div>

                    <input type="submit" onClick={(e) => props.registerUser(e, userDetail)} class="form__button" value="Register" />
    </div>
  )
}

export default DetailForm