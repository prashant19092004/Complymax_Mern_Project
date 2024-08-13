import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import './Admin.css'

const Student = () => {

  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  
  console.log(token);
  async function authentication() {
    
      try{
        await axios.get("http://localhost:9000/admin", {
          headers : {
            Authorization : `Bearer ${token}`
          }
        })
        .then((res) => {
          console.log(res.data.success);
          if(res.data.success===false){
            navigate("/")
            toast.success(res.data.message);
          }
        })
      }
      catch(err){
        navigate("/")
        toast.success("jguyhg");
      }
    
  }

  function logout(){
    localStorage.removeItem("token");
    navigate("/");
  }

  useEffect(()=> authentication, []);

  return (
    <div class="bg-orange-100 min-h-screen">
  <div class="fixed bg-white text-blue-800 px-10 py-1 z-10 w-full">
      <div class="flex items-center justify-between py-2 text-5x1">
        <div class="font-bold text-blue-900 text-xl">User<span class="text-orange-600">Panel</span></div>
        <div class="flex items-center text-gray-500">
          <span class="material-icons-outlined p-2" style={{fontSize: '30px'}}>search</span>
          <span class="material-icons-outlined p-2" style={{fontSize: '30px'}}>notifications</span>
          <div class="bg-center bg-cover bg-no-repeat rounded-full inline-block h-12 w-12 ml-2" style={{backgroundImage: 'url(https://i.pinimg.com/564x/de/0f/3d/de0f3d06d2c6dbf29a888cf78e4c0323.jpg)'}}></div>
        </div>
    </div>
  </div>
  
  <div class="flex flex-row pt-24 px-10 pb-4">
    <div class="w-2/12 mr-6">
      <div class="bg-white rounded-xl shadow-lg mb-6 px-6 py-4">
        <Link to="/Student/" class="inline-block text-gray-600 hover:text-black my-4 w-full">
          <span class="material-icons-outlined float-left pr-2">dashboard</span>
          Training
          <span class="material-icons-outlined float-right">keyboard_arrow_right</span>
        </Link>
        <Link to="/student/record" class="inline-block text-gray-600 hover:text-black my-4 w-full">
          <span class="material-icons-outlined float-left pr-2">tune</span>
          Records
          <span class="material-icons-outlined float-right">keyboard_arrow_right</span>
        </Link>
        {/* <Link to="/admin/trainings" class="inline-block text-gray-600 hover:text-black my-4 w-full">
          <span class="material-icons-outlined float-left pr-2">file_copy</span>
          
          <span class="material-icons-outlined float-right">keyboard_arrow_right</span>
        </Link> */}
      </div>

      <div class="bg-white rounded-xl shadow-lg mb-6 px-6 py-4">
      {/* <Link to="/admin/trainers" class="inline-block text-gray-600 hover:text-black my-4 w-full">
          <span class="material-icons-outlined float-left pr-2">file_copy</span>
          
          <span class="material-icons-outlined float-right">keyboard_arrow_right</span>
        </Link>
        <a href="" class="inline-block text-gray-600 hover:text-black my-4 w-full">
          <span class="material-icons-outlined float-left pr-2">settings</span>
          
          <span class="material-icons-outlined float-right">keyboard_arrow_right</span>
        </a> */}
        <a href="" onClick={logout} class="inline-block text-gray-600 hover:text-black my-4 w-full">
          <span class="material-icons-outlined float-left pr-2">power_settings_new</span>
          Log out
          <span class="material-icons-outlined float-right">keyboard_arrow_right</span>
        </a>
      </div>
    </div>
    
    <div class="w-10/12">
      <Outlet />
    </div>
  </div>
</div>
  )
}

export default Student