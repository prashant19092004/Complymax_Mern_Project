import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import default_pic from '../../assets/Default_pfp.svg.png';
import { Link, useNavigate } from 'react-router-dom';

const ProfileDropdown = () => {

  const navigate = useNavigate();

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
          href=""
          ref={ref}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        >
          {children}
          <img className='profile_pic' src={default_pic} alt='' />
        </a>
      ));

      function logout(){
        localStorage.removeItem("token");
        navigate("/");
      }

  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
          {/* <img className='profile_pic' src='https://images.unsplash.com/photo-1474447976065-67d23accb1e3?q=80&w=1285&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='' /> */}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item><Link to='/client_dashboard/profile'>Profile</Link></Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;