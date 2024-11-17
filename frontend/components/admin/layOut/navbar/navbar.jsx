import React from 'react';
import { Navbar ,Container ,Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logoeiei from '../../../../src/assets/Logoeiei.png'
import Sidebaradmin from '../sidebar/sidebaradmin';
import { Link, NavLink } from "react-router-dom"
import { logout } from '../../../../API/authService';

function Navbaradmin() {

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="navbar navbar-expand-lg" >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Sidebar สำหรับหน้าจอเล็ก */}
        <div className="d-lg-none">
          <Sidebaradmin />
        </div>

        {/* โลโก้ */}
        <a className="navbar-brand" href="/">
          <img
            src={Logoeiei}
            alt="Logo"
            style={{ height: '40px' }}
          />
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