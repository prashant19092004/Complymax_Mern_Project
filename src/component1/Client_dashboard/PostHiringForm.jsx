import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientForm.css';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const PostHiringForm = () => {

    const token = localStorage.getItem("token");
    const [temp1, setTemp1] = useState("");
    const [hiringData, setHiringData] = useState({
        client : "",
        state : "",
        location: "",
        job_category: "",
        no_of_hiring : "",
        skill : "",
        client_id : "",
        location_id : ""
    });
    let filteredData1;
    const [filteredData, setFilteredData] = useState();
    const [filteredStateData, setFilteredStateData] = useState();
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
    };

    const clientChangeHandler = async(e) => {

        const temp = e.target.value;
        
        const arr = temp.split(",");
        console.log(arr);
        setHiringData({ ...hiringData, client : e.target.value, client_id : arr[0]});   
    }

    let locationChangeHandler =(e) => {
        const temp = e.target.value;

        const filtered1 = filteredStateData && filteredStateData.length && filteredStateData.filter((loc) => {
            return(loc._id = temp);
        })
        setHiringData({ ...hiringData, [e.target.name] : filtered1[0].location, location_id : e.target.value});
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

    let postHiring = async(e) => {
        e.preventDefault();
        console.log(hiringData);
        try{
            await axios.post('http://localhost:9000/establisment/hiring', 
                hiringData,
                {
                    headers: {
                      Authorization : `Bearer ${token}`
                    }
                }    
            )
            .then((res) => {
                // console.log(res);
                if(res.data.success){
                    setHiringData({
                        client : "",
                        state : "",
                        location: "",
                        job_category: "",
                        no_of_hiring : "",
                        skill : "",
                        client_id : "",
                        location_id : ""
                    })
                    navigate('/establisment_dashboard/hiring');
                    toast.success(res.data.message);
                }
                else{
                    toast.error("try again");
                }
            })
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(() => {fetchingProfile();}, []);
    useEffect(() => {

        let filteredData1 = establismentData?.clients.filter((client) => {
            return ( client._id === hiringData.client_id)
        })
        
        setFilteredData(filteredData1);
        // console.log(filteredData);

        
    }, [hiringData.client_id]);
    
    useEffect(() => {
                
        filteredData1 = filteredData && filteredData.length && filteredData[0].locations?.filter((loc) => {
            return ( loc.state === hiringData.state)
        })
        
        setFilteredStateData(filteredData1);
    }, [hiringData.state]);
    
    if(loading){
        return <div>Loading...</div>
    }
    
    return (
    <div className='client_form'>
        <div class="form">
                {/* <img src={login_pic} alt="" class="form__img" /> */}

                <form action="" onSubmit={postHiring} class="form__content d-flex flex-column">
                    <h1 class="form__title">Post Hiring</h1>
                    <div className='client_forms_box d-flex flex-wrap'>
                        <div class="form__div form__div-one">
                            <div class="form__icon">
                                <i class='bx bx-user-circle'></i>
                            </div>

                            <div class="form__div-input">
                                <label for="state" class="form__label"></label>
                                <select onChange={clientChangeHandler} name="client" id="client" value={hiringData.client} class="form__input" placeholder="" required="">
                                    <option value="">Select Client</option>
                                    {
                                        establismentData.clients.map((client) => {
                                            return(
                                                <option key={client.name} value={`${client._id},${client.name}`}>{client.name}</option>
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
                                        filteredData && filteredData.length && filteredData[0]?.locations.map((location) => {
                                            return (
                                                <option key={location.state} value={location.state}>{location.state}</option>
                                            )
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
                                <label for="location" class="form__label"></label>
                                <select onChange={locationChangeHandler} name="location" id="location" disabled={hiringData.state === ''} class="form__input" placeholder="" required="">
                                    <option value="">Select Location</option>
                                    {
                                        filteredStateData && filteredStateData.length && filteredStateData.map((loc) => {
                                            return (
                                                <option key={loc.location} value={loc._id}>{loc.location}</option>
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
                            <label for="" class="form__label">Job Categorie</label>
                            <input type="text" name='job_category' onChange={changeHandle} required id='job_category' class="form__input" onFocus={addfocus} onBlur={remfocus}/>
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
                                <select onChange={changeHandle} name="skill" id="skill" class="form__input" placeholder="" required="">
                                    <option value="">Select Skill</option>
                                    <option key="skilled" value="skilled">Skilled</option>
                                    <option key="unskilled" value="unskilled">Unskilled</option>
                                    <option key="Semi-Skilled" value="Semi-Skilled">Semi-Skilled</option>
                                </select>
                            </div>
                        </div>
                        <div class="form__div form__div-one">
                            <div class="form__icon">
                                <i class='bx bx-lock' ></i>
                            </div>

                            <div class="form__div-input">
                                <label for="" class="form__label">No of Hiring</label>
                                <input type="text" name='no_of_hiring' onChange={changeHandle} required id='no_of_hiring' class="form__input" onFocus={addfocus} onBlur={remfocus}/>
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