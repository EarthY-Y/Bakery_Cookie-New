import React from 'react';
import { Navbar ,Container ,Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebaradmin from '../sidebar/sidebaradmin';
import { Link, NavLink } from "react-router-dom"
import { logoutAdmin } from '../../../../API/authService';

function Navbaradmin() {

  const handleLogout = () => {
    logoutAdmin()
  }

  return (
    <nav className="navbar navbar-expand-lg" style={{ height: '65px' }}>
      <div className="container-fluid" style={{ height: '100%' }}>
        {/* Sidebar สำหรับหน้าจอเล็ก */}
        <div className="d-lg-none" style={{ height: '100%' }}>
          <Sidebaradmin />
        </div>

        {/* โลโก้ */}
        <img src="../../../../src/assets/LogoCN1.PNG" alt="Logo" style={{ height: '50px'}} />

        {/* ปุ่มออกจากระบบ */}
        <button className="btn btn-outline-danger text-white" style={{border: '1.5px solid #000',borderRadius: '10px',padding: '5px 10px',}} 
          onClick={(e) => handleLogout()}>
          ออกจากระบบ
        </button>
      </div>
    </nav>
  )
}

export default Navbaradmin;