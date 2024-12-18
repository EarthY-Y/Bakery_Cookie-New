import React from 'react';
import { Navbar ,Container ,Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../../../src/assets/Logo.png'
import Sidebaradmin from '../sidebar/sidebaradmin';
import { Link, NavLink } from "react-router-dom"
import { logoutAdmin } from '../../../../API/authService';

function Navbaradmin() {

  const handleLogout = () => {
    logoutAdmin()
  }

  return (
    <nav className="navbar navbar-expand-lg" style={{ height: '65px' }}>
      <div className="container-fluid d-flex justify-content-between align-items-center" style={{ height: '100%' }}>
        {/* Sidebar สำหรับหน้าจอเล็ก */}
        <div className="d-lg-none" style={{ height: '100%' }}>
          <Sidebaradmin />
        </div>

        {/* โลโก้ */}
        <a className="navbar-brand" href="/" style={{ height: '100%', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <img
              src={Logo}
              alt="Logo"
              style={{ height: '80px' }}
            />
          </div>
        </a>

        {/* ปุ่มออกจากระบบ */}
        <button 
          className="btn btn-outline-danger text-white" 
          style={{
            border: '1.5px solid #000',
            borderRadius: '10px',
            padding: '5px 10px',
          }} 
          onClick={(e) => handleLogout()}>
          ออกจากระบบ
        </button>
      </div>
    </nav>
  )
}

export default Navbaradmin;