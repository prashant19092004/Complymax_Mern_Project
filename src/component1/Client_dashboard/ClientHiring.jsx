import React, { useState, useEffect } from 'react'
import defaultProfile from '../../assets/Default_pfp.svg.png';
import './list.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClientHiring = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
    const [clients, setClients] = useState();
    const [filteredClients, setFilteredClients] = useState();
    const [loading, setLoading] = useState(true);

//   async function fetchingProfile(){
//     try{
//       await axios.get("http://localhost:9000/establisment/clientlist", {
//         headers: {
//           Authorization : `Bearer ${token}`
//         }
//       })
//       .then((res) => {
//         console.log(res.data.clients);
//         setClients(res.data.clients);
//         setFilteredClients(res.data.clients);
//         setLoading(false);
//         // setUser(res.data);
//       })
//     }catch(err){
//       console.log(err);
//     }
//   }

  // console.log(userHistory)
//   useEffect(() => {
//     fetchingProfile();
//   }, []);

//   if(loading){
//     return(<div>Loading...</div>)
//   }
  
    let postHiringButtonHandler = () => {
        navigate('/establisment_dashboard/post_hiring');
    }

    function toggleShow () {
      var el = document.getElementById("box");
      el.classList.toggle("show");
    }

    let changeHandle = (e) => {
        let query = e.target.value.toLowerCase();

          const filteredData = 
              clients && clients.length? clients.filter((client) => client.name.toLowerCase().indexOf(query) > -1) : [];
          setFilteredClients(filteredData);
          // setShowDropDown(true);
    }

    let getClientDetail = (uid) => {
      console.log(uid);
      navigate('/establisment_dashboard/client_detail', {state : uid});
    }


    return (
    <div>
        <div className='ragister_div'>
            <div className='search_container'>
                  <input type="text" id="box" placeholder="Search...." class="search__box" onChange={changeHandle} />
                  <i class="fas fa-search search__icon" id="icon" onClick={toggleShow}></i>
            </div>
            <Button className='mt-2' onClick={postHiringButtonHandler} varient='primary'>Post Hiring</Button>
        </div>
        {/* <ul className='list_box'>
            {
                filteredClients.map((client) => {
                    return (
                        <li className='list' onClick={() => getClientDetail(client._id)}>
                            <div className='list-left'>
                                <img className='' src={defaultProfile} alt='' />
                                <p>{client.name}</p>
                            </div>
                            <div className='list-middle'>
                                <p>{client.contact}</p>
                            </div>
                            <div className='list-right'>
                                <p>{client.status ? 'Active' : 'Inactive'}</p>
                            </div>
                        </li>
                    )
                })
            }
        </ul> */}
        <div className='hiringsList'>
            <div>
                <h1>Worker</h1>
                
            </div>
        </div>
    </div>
  )
}

export default ClientHiring