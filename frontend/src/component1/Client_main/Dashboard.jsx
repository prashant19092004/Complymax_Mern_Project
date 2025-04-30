import React, { useEffect, useState } from 'react'
import '../Client_dashboard/Client_dashboard.css';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo2.png'
import LogoHalf from '../../assets/logo-half.png';
import axios from 'axios';
import ProfileDropdown from './ProfileDropdown';
import NotificationIcon from './NotificationIcon';
import { toast } from 'react-toastify';
import { FaHome, FaUserCircle, FaHeadset, FaPhone } from 'react-icons/fa';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { HiMenuAlt2 } from 'react-icons/hi';
import { motion } from "framer-motion";

const Dashboard = () => {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    async function fetchingProfile() {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client-dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(res.data);
            setLoading(false);
        } catch (err) {
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
        { path: "/client_dashboard/", icon: <FaHome />, label: "Dashboard" },
        { path: "/client_dashboard/profile", icon: <FaUserCircle />, label: "Profile" },
        { path: "/client_dashboard/", icon: <FaPhone />, label: "Emergency Contact No." },
        { path: "/client_dashboard/", icon: <FaHeadset />, label: "Support 24/7" }
    ];

    if (loading) {
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
    );
}

export default Dashboard;