import React from 'react';
import { Navbar ,Container ,Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logoeiei from '../../../../src/assets/Logoeiei.png'
import { Link, NavLink } from "react-router-dom"
import { logout } from '../../../../API/authService';

function Navbaradmin() {

  const handleLogout = () => {
    logout()
  }

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#347928', height: '65px' }}>
      <Container fluid className="d-flex justify-content-between align-items-center">
        
        {/* โลโก้ */}
        <Navbar.Brand href="/">
          <img
            src={Logoeiei}
            alt="Logo"
            style={{ height: '40px' }}
          />
        </Navbar.Brand>

        {/* ปุ่มออกจากระบบ */}
        <Button 
          as={Link} 
          to="/logout" 
          variant="outline-danger" 
          className="text-white"
          style={{
            // backgroundColor: '#FFCC00',
            border: '1.5px solid #000',
            borderRadius: '10px',
            padding: '5px 10px',
          }} onClick={(e) => handleLogout()}>
          ออกจากระบบ
        </Button>
      </Container>
    </Navbar> 
  )
}

export default Navbaradmin;