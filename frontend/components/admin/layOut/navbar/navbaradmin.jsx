import React from 'react';
import { Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbaradmin() {
  return (
    <Navbar bg="light">
      <Navbar.Brand to="#" className="ms-5 py-0" style={{ height: '40px' }} >
        <img
          src="https://via.placeholder.com/30"
          width="50"
          height="40"
          className="d-inline-block align-top"
          alt="Logo"
        />
      </Navbar.Brand>
    </Navbar>
  );
}

export default Navbaradmin;