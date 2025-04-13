import React, { useEffect, useState } from 'react'
import './Client_dashboard.css';
import { Outlet, Link, useLocation } from 'react-router-dom';
import close from '../../assets/close.png';
import Logo from '../../assets/logo2.png'
import LogoHalf from '../../assets/logo-half.png';
import axios from 'axios';
import ProfileDropdown from './ProfileDropdown';
import NotificationIcon from './NotificationIcon';
import { toast } from 'react-toastify';
import { FaHome, FaChartBar, FaBriefcase, FaUserPlus, FaUsers, FaUserTie, FaHeadset, FaUserCircle } from 'react-icons/fa';
import { IoNotificationsOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { HiMenuAlt2 } from 'react-icons/hi';

const Client_dashboard = () => {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  async function fetchingProfile(){
    try{
        setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/establisment/profile`, {
        headers: {
                    Authorization: `Bearer ${token}`
        }
            });
        setUser(res.data);
        setLoading(false);
    }catch(err){
        setLoading(false);
        toast.error('Internal Server Error');
    }
  }

  useEffect(() => {
    fetchingProfile();
  }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const navItems = [
        { path: "/establisment_dashboard/", icon: <FaHome />, label: "Dashboard" },
        { path: "/establisment_dashboard/analytics", icon: <FaChartBar />, label: "Analytics" },
        { path: "/establisment_dashboard/job-categories", icon: <FaBriefcase />, label: "Job Categories" },
        { path: "/establisment_dashboard/client_registration", icon: <FaUserPlus />, label: "Client Registration" },
        { path: "/establisment_dashboard/sub-admins", icon: <FaUsers />, label: "Sub Admins" },
        { path: "/establisment_dashboard/supervisor_registration", icon: <FaUserTie />, label: "Supervisor Registration" },
        { path: "/establisment_dashboard/support", icon: <FaHeadset />, label: "Support 24/7" },
        { path: "/establisment_dashboard/establisment_profile", icon: <FaUserCircle />, label: "Profile" }
    ];

    if(loading){
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

  return (
        <div className="dashboard-wrapper">
            <div className={`dashboard-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <nav className="sidebar">
                    <div className="sidebar-header">
                        <motion.img 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            src={sidebarCollapsed ? LogoHalf : Logo} 
                            alt="Company Logo" 
                            className={`company-logo ${sidebarCollapsed ? 'logo-small' : ''}`}
                        />
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="sidebar-toggle desktop-only"
                            onClick={toggleSidebar}
                            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {sidebarCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
                        </motion.button>
            </div>
            
                    <div className="nav-links">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Link
                                    to={item.path}
                                    className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className={`nav-label ${sidebarCollapsed ? 'collapsed' : ''}`}>
                                        {item.label}
                                    </span>
                        </Link>
                            </motion.div>
                        ))}
        </div>
    </nav>

                <main className="main-content">
                    {/* Mobile Header */}
                    <div className="mobile-header">
                        <div className="mobile-logo">
                            <img 
                                src={Logo} 
                                alt="Company Logo" 
                                className="mobile-company-logo"
                            />
                        </div>
                        <div className="mobile-actions">
                            <ProfileDropdown profile_pic={user?.profilePic} />
                            <button 
                                className="mobile-menu-btn"
                                onClick={toggleSidebar}
                            >
                                {sidebarCollapsed ? <MdKeyboardArrowLeft size={24} /> : <HiMenuAlt2 size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Welcome Section */}
                    <div className="mobile-welcome-section">
                        <h1 className="mobile-welcome-text">
                            Welcome back, <span className="user-name">{user?.name}</span>
                        </h1>
                        <p className="mobile-date-text">{new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</p>
                    </div>

                    {/* Desktop Header */}
                    <div className="dashboard-header">
                        <div className="desktop-header">
                            <div className="header-left">
                                <h1 className="welcome-text">
                                    Welcome back, <span className="user-name">{user?.name}</span>
                                </h1>
                                <p className="date-text">{new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</p>
                            </div>
                            <div className="header-actions">
                                <NotificationIcon />
                                <div className="divider-vertical"></div>
                                <ProfileDropdown profile_pic={user?.profilePic} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="content-area">
                        <Outlet />
                </div>
                </main>
</div>
    </div>
  )
}

export default Client_dashboard