import React, { useEffect, useState } from 'react'

const Jobs = () => {

    const token = localStorage.getItem("token");
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);

  async function fetchingProfile(){
    setLoading(true);
    try{
      await axios.get("http://localhost:9000/userdashboard", {
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
        setLoading(false);
      })
    }catch(err){
      console.log(err);
    }
  }


  // console.log(userHistory)
  useEffect(() => {
    fetchingProfile();
  }, []);

  if(loading){
    return( <div>Loading...</div> )
  }


  return (
    <div>
      
    </div>
  )
}

export default Jobs