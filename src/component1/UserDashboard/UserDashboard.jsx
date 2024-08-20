import React, { useEffect, useState } from 'react'
import '../Client_dashboard/Client_dashboard.css';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import close from '../../assets/close.png';
import Logo from '../../assets/logo2.png'
import axios from 'axios';
import ProfileDropdown from './ProfileDropdown';
import NotificationIcon from './NotificationIcon';


const UserDashboard = () => {

    const navigate = useNavigate();
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


//   if(loading){
//     <div>Loading...</div>
//   }

    function menuClickHandler(){
        // console.log("Hii");
        document.querySelector('#sidebarCollapse').style.left = '0';
        document.querySelector('.menu-close').style.display = 'block';
        document.querySelector('#menu_button').style.display = 'none';
    }
    
    function closeClickHandler(){
        console.log("Hii");
        document.querySelector('#sidebarCollapse').style.left = '-100%';
        document.querySelector('.menu-close').style.display = 'none';
        document.querySelector('#menu_button').style.display = 'block';
    }

  return (
    <div>

{/* <!-- Dashboard --> */}
<div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
    {/* <!-- Vertical Navbar --> */}
    <nav className="navbar show navbar-vertical h-lg-screen navbar-expand-lg px-0 py-0 navbar-light bg-white border-bottom border-bottom-lg-0 border-end-lg" id="navbarVertical">
        <div className="container-fluid" id='sidebar_div'>
            {/* <!-- Toggler --> */}
            
            {/* <!-- Brand --> */}
            <a className="" id='navbar_brand' href="#">
                <img src={Logo} alt="..." />
            </a>
            {/* <!-- User menu (mobile) --> */}
            <div className=' gap-4' id='nav_menu_div'>
            
                <ProfileDropdown /> 
                <button className="navbar-toggler ms-n2" type="button" onClick={menuClickHandler} id='menu_button'>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <img onClick={closeClickHandler} class="menu-close" src={close} alt="" />
            </div>
            
            {/* <!-- Collapse --> */}
            <div className="sidebarCollapse" id="sidebarCollapse">
                {/* <img onClick={closeClickHandler} class="menu-close" src={close} alt="" /> */}
                {/* <!-- Navigation --> */}
                <ul className="navbar-nav" id='nav_div'>

                    {
                        user && user.job ? 
                            `<li className="nav-item" id='nav_item'>
                        <Link className="nav-link" to="/user_dashboard/dashboard">
                            <i className="bi bi-house"></i> Dashboard
                        </Link>
                    </li>` : ''
                    }
                    
                    <li className="nav-item" id='nav_item'>
                        <Link className="nav-link" to="/user_dashboard/">
                            <i className="bi bi-house"></i> Jobs
                        </Link>
                    </li>
                    <li className="nav-item" id='nav_item'>
                        <Link className="nav-link" to="/user_dashboard/user_profile">
                            <i className="bi bi-bar-chart"></i> Profile
                        </Link>
                    </li>
                    <li className="nav-item" id='nav_item'>
                        <Link className="nav-link" to="/user_dashboard/user_profile">
                            <i className="bi bi-bar-chart"></i>Add Job Experience
                        </Link>
                    </li>
                    <li className="nav-item" id='nav_item'>
                        <Link className="nav-link" to="/establisment_dashboard/client_registration">
                        <i class="bi bi-person"></i> Emergency Contact No.
                            {/* <span className="badge bg-soft-primary text-primary rounded-pill d-inline-flex align-items-center ms-auto">6</span> */}
                        </Link>
                    </li>
                    <li className="nav-item" id='nav_item'>
                        <Link className="nav-link" to='/establisment_dashboard/sub_admin'>
                        <i class="bi bi-person-plus"></i> Support 24/7
                            {/* <span className="badge bg-soft-primary text-primary rounded-pill d-inline-flex align-items-center ms-auto">6</span> */}
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    {/* <!-- Main content --> */}
    <div className="flex-grow-1 overflow-y-lg-auto" id='main_div'>
        {/* <!-- Header --> */}
        <header className="bg-surface-primary border-bottom pt-6" id="dashboard_header">
            <div className="container-fluid">
                <div className="mb-npx">
                    <div className="row align-items-center">
                        <div className="col-sm-10 col-12 mb-sm-0 mb-0">
                            {/* <!-- Title --> */}
                            <h1 className="h2 mb-0 ls-tight">Welcome {user && user.full_Name}</h1>
                        </div>
                        {/* <!-- Actions --> */}
                        <div className="col-sm-2 col-12 text-sm-end">
                            {/* <div className="mx-n1">
                                <a href="#" className="btn d-inline-flex btn-sm btn-neutral border-base mx-1">
                                    <span className=" pe-2">
                                        <i className="bi bi-pencil"></i>
                                    </span>
                                    <span>Edit</span>
                                </a>
                                <a href="#" className="btn d-inline-flex btn-sm btn-primary mx-1">
                                    <span className=" pe-2">
                                        <i className="bi bi-plus"></i>
                                    </span>
                                    <span>Create</span>
                                </a>
                            </div> */}
                            <div className='profile_pic_toggle'>
                                <NotificationIcon />
                                <ProfileDropdown />
                            </div>
                            
                        </div>
                    </div>
                    {/* <!-- Nav --> */}
                    <ul className="nav nav-tabs mt-4 overflow-x border-0">
                  
                    </ul>
                </div>
                <div className='requirement_box'>
                {/* {user.account_added && */}
                    <div>
                        <p>You haven't add your account yet.</p>
                        <button onClick={() => navigate('/user_dashboard/add_account')}>Add Account</button>
                    </div>
                {/* } */}
                {/* {user.pan_added && */}
                    <div>
                        <p>You haven't add your PAN yet.</p>
                        <button onClick={() => navigate('/user_dashboard/add_pan')}>Add Pan</button>
                    </div>
                {/* } */}
                </div>
            </div>
        </header>
        {/* <!-- Main --> */}
        <div id='outlet_div'>
            <Outlet />
        </div>
    </div>
</div>
    </div>
  )
}

export default UserDashboard