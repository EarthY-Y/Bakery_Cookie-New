import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';

function Sidebaradmin() {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-light border" id="sidebar-wrapper" style={{ width: '250px', height: '100vh' }}>
        <div className="sidebar-heading">My Sidebar</div>
        <div className="list-group list-group-flush">
          <Link to="#" className="list-group-item list-group-item-action bg-light">Dashboard</Link>
          <Link to="#" className="list-group-item list-group-item-action bg-light">Profile</Link>
          <Link to="#" className="list-group-item list-group-item-action bg-light">Settings</Link>
          <Link to="#" className="list-group-item list-group-item-action bg-light">Help</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid">
        <button className="btn btn-primary mt-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar-wrapper" aria-controls="sidebar-wrapper">
          Toggle Sidebar
        </button>
        <div className="mt-5">
          <h2>Main Content Area</h2>
          <p>This is where your main content will go.</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebaradmin;