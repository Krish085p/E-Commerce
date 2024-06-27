import React from 'react';
import './Navbar.css'; // Using CSS modules
import navlogo from '../assets/nav-logo.svg';
import navprofile from '../assets/nav-profile.svg';

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={navlogo} alt="Navigation Logo" className="nav-logo" />
      <img src={navprofile} alt="Profile Icon" className="nav-Profile" /> 
    </div>
  );
};

export default Navbar;
