import React, { useEffect, useState } from "react";
import "../Client_dashboard/Client_dashboard.css";
import { Outlet, Link, useNavigate } from "react-router-dom";
import close from "../../assets/close.png";
import Logo from "../../assets/logo2.png";
import LogoHalf from "../../assets/logo-half.png";
import axios from "axios";
import ProfileDropdown from "./ProfileDropdown";
import NotificationIcon from "./NotificationIcon";
import default_pic from "../../assets/Default_pfp.svg.png";
import { toast } from "react-toastify";
import {
  FaHome,
  FaChartBar,
  FaUser,
  FaUserPlus,
  FaHeadset,
  FaUserCircle,
} from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { getToken } from "../../utils/tokenService"; // Assuming you have a utility function to get the token

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  async function fetchingProfile() {
    const token = await getToken();
    setLoading(true);
    try {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/user-dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUser(res.data.currentUser);
          setLoading(false);
        });
    } catch (err) {
      toast.error("Try Again..");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchingProfile();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const navItems = [
    {
      path: "/user_dashboard/dashboard",
      icon: <FaHome />,
      label: "Dashboard",
      show: user?.job,
    },
    {
      path: "/user_dashboard/",
      icon: <FaHome />,
      label: "Jobs",
      show: user && !user.job,
    },
    {
      path: "/user_dashboard/user_profile",
      icon: <FaUser />,
      label: "Profile",
      show: true,
    },
    {
      path: "/user_dashboard/dashboard",
      icon: <FaChartBar />,
      label: "Add Job Experience",
      show: true,
    },
    {
      path: "/user_dashboard/dashboard",
      icon: <FaUserPlus />,
      label: "Emergency Contact No.",
      show: true,
    },
    {
      path: "/user_dashboard/dashboard",
      icon: <FaHeadset />,
      label: "Support 24/7",
      show: true,
    },
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
      <div
        className={`dashboard-container ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <nav className="sidebar">
          <div className="sidebar-header">
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              src={sidebarCollapsed ? LogoHalf : Logo}
              alt="Company Logo"
              className={`company-logo ${sidebarCollapsed ? "logo-small" : ""}`}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="sidebar-toggle desktop-only"
              onClick={toggleSidebar}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <MdKeyboardArrowRight />
              ) : (
                <MdKeyboardArrowLeft />
              )}
            </motion.button>
          </div>

          <div className="nav-links">
            {navItems.map(
              (item, index) =>
                item.show && (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={item.path}
                      className={`nav-item ${
                        window.location.pathname === item.path ? "active" : ""
                      }`}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span
                        className={`nav-label ${
                          sidebarCollapsed ? "collapsed" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                )
            )}
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
              <button className="mobile-menu-btn" onClick={toggleSidebar}>
                {sidebarCollapsed ? (
                  <MdKeyboardArrowLeft size={24} />
                ) : (
                  <HiMenuAlt2 size={24} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Welcome Section */}
          <div className="mobile-welcome-section">
            <h1 className="mobile-welcome-text">
              Welcome, <span className="user-name">{user?.full_Name}</span>
            </h1>
            <p className="mobile-date-text">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Desktop Header */}
          <div className="dashboard-header">
            <div className="desktop-header">
              <div className="header-left">
                <h1 className="welcome-text">
                  Welcome, <span className="user-name">{user?.full_Name}</span>
                </h1>
                <p className="date-text">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="header-actions">
                <NotificationIcon />
                <div className="divider-vertical"></div>
                <ProfileDropdown profile_pic={user?.profilePic} />
              </div>
            </div>
          </div>

          {/* Alert Section */}
          <div
            className="w-full d-flex flex-wrap gap-2 px-3"
            style={{ backgroundColor: "#1e3686", paddingBlock: "4px" }}
          >
            {" "}
            {!user.account_added && (
              <div className="d-flex gap-1">
                <p
                  className=""
                  style={{ color: "white", fontSize: "0.8rem", margin: "0px" }}
                >
                  You haven't add your Account
                </p>
                <button
                  onClick={() => {
                    navigate("/user_dashboard/add_account");
                  }}
                  className=""
                  style={{
                    background: "transparent",
                    fontSize: "0.7rem",
                    paddingInline: "2px",
                    color: "white",
                    border: "1px solid white",
                  }}
                >
                  Add Account
                </button>
              </div>
            )}
            {!user.pan_added && (
              <div className="d-flex gap-1">
                <p
                  className=""
                  style={{ color: "white", fontSize: "0.8rem", margin: "0px" }}
                >
                  You haven't add your Pan
                </p>
                <button
                  onClick={() => {
                    navigate("/user_dashboard/add_pan");
                  }}
                  className=""
                  style={{
                    background: "transparent",
                    fontSize: "0.7rem",
                    paddingInline: "2px",
                    color: "white",
                    border: "1px solid white",
                  }}
                >
                  Add Pan
                </button>
              </div>
            )}
          </div>

          <div className="content-area">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
