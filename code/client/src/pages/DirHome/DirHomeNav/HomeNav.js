// src/components/DirNavbar/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import '../../../components/dirNavbar/Navbar.css';

function HomeNav() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Account Creation</Link></li>
          <li><Link to="/Food">Account Login</Link></li>
        </ul>
      </nav >
    </div >
  );
}

export default HomeNav;