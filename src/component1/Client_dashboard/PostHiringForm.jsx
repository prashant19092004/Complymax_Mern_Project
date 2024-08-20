import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientForm.css';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const PostHiringForm = () => {

    const token = localStorage.getItem("token");
    const [hiringData, setHiringData] = useState({
        client : "",
        state : "",
        location: "",
        job_category: "",
        no_of_hiring : "",
        skilled : ""
    });
    const [loading, setLoading] = useState(true);
    const [establismentData, setEstablismentData] = useState();
    let states_of_india = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal"
    ]
    const navigate = useNavigate();
    
    const changeHandle = (e) => {
        setHiringData({ ...hiringData, [e.target.name]: e.target.value });
        // console.log(loginData);
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

    // let fetchingData = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     try{
    //         const response = await axios.get(
    //             "http://localhost:9000/establisment/hiring_form",
    //             {
    //                 headers: {
    //                   Authorization : `Bearer ${token}`
    //                 }
    //             }
    //         )
    //         .then((res) => {
    //             console.log(res);
    //             setLoading(false);
    //         })
    //     }catch(err){
    //         console.log("try again");
    //     }
    // }

    async function fetchingProfile(){
        setLoading(true);
        try{
          await axios.get("http://localhost:9000/establisment/profile", {
            headers: {
              Authorization : `Bearer ${token}`
            }
          })
          .then((res) => {
            console.log(res.data);
            setEstablismentData(res.data);
            setLoading(false);
          })
        }catch(err){
          console.log(err);
        }
      }

    useEffect(() => {fetchingProfile();}, []);

    if(loading){
        return <div>Loading...</div>
    }


  return (
    <div className='client_form'>
        <div class="form">
                {/* <img src={login_pic} alt="" class="form__img" /> */}

                <form action="" class="form__content d-flex flex-column">
                    <h1 class="form__title">Post Hiring</h1>
                    <div className='client_forms_box d-flex flex-wrap'>
                        <div class="form__div form__div-one">
                            <div class="form__icon">
                                <i class='bx bx-user-circle'></i>
                            </div>

                            <div class="form__div-input">
                                <label for="state" class="form__label"></label>
                                <select onChange={changeHandle} name="client" id="client" value={hiringData.client} class="form__input" placeholder="" required="">
                                    <option value="">Select Client</option>
                                    {
                                        establismentData.clients.map((client) => {
                                            return(
                                                <option key={client.name} value={client.name}>{client.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div class="form__div form__div-one">
                            <div class="form__icon">
                                <i class='bx bx-user-circle'></i>
                            </div>

                            <div class="form__div-input">
                                <label for="state" class="form__label"></label>
                                <select onChange={changeHandle} name="state" id="s" disabled={hiringData.client === ''} class="form__input" placeholder="" required="">
                                    <option value="">Select State</option>
                                    {
                                        establismentData.clients.map((client) => {
                                            if(client.name === hiringData.client){
                                                for(let i=0; i<client.locations.length; i++){
                                                    
                                                }
                                                client.locations.map((location) => {
                                                    return(
                                                        <option key={location.state} value={location.state}>{location.state}</option>
                                                    )
                                                })
                                                
                                            }
                                            
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className='client_forms_box d-flex flex-wrap'>
                        <div class="form__div form__div-one">
                            <div class="form__icon">
                                <i class='bx bx-user-circle'></i>
                            </div>

                            <div class="form__div-input">
                                <label for="" class="form__label">Skilled</label>
                                <input 
                                type="email" 
                                name='email' 
                                onChange={changeHandle} 
                                required 
                                // value={clientRegisterData.email} 
                                id='email' 
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
                            <label for="" class="form__label">Job Categorie</label>
                            <input type="password" name='password' onChange={changeHandle} required id='password' class="form__input" onFocus={addfocus} onBlur={remfocus}/>
                        </div>
                        </div>
                    </div>

                    <div className='client_forms_box d-flex flex-wrap'>
                        <div class="form__div form__div-one">
                            <div class="form__icon">
                                <i class='bx bx-user-circle'></i>
                            </div>

                            <div class="form__div-input">
                                <label for="state" class="form__label"></label>
                                <select onChange={changeHandle} name="state" id="state" class="form__input" placeholder="" required="">
                                    <option value="">Select State</option>
                                    {
                                        states_of_india.map((state) => {
                                            return(
                                                <option key={state} value={state}>{state}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div class="form__div form__div-one">
                            <div class="form__icon">
                                <i class='bx bx-lock' ></i>
                            </div>

                            <div class="form__div-input">
                                <label for="" class="form__label">No of Hiring</label>
                                <input type="text" name='location' onChange={changeHandle} required id='location' class="form__input" onFocus={addfocus} onBlur={remfocus}/>
                            </div>
                        </div>
                    </div>
                    {/* <a href="#" class="form__forgot">Forgot Password?</a> */}

                    <input type="submit" class="form__button" value="Submit" />

                </form>
            </div>
    </div>
  )
}

export default PostHiringForm