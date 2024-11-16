import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebaradmin() {
  const [show, setShow] = useState(false);
  const toggleOffcanvas = () => {
    setShow(!show);
  };

  return (
    <div>
      {/* Navbar สำหรับหน้าจอเล็ก */}
      <nav className="navbar navbar-light bg-light mb-3 d-md-none p-1">
        <button className="navbar-toggler" type="button" aria-label="Toggle navigation" onClick={toggleOffcanvas}>
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>

      {/* Sidebar สำหรับหน้าจอใหญ่ */}
      <div className="d-none d-md-block bg-light p-3" style={{ width: '250px', height: '100vh', position: 'fixed' }}>
        <nav className="nav flex-column">
          <Link className="nav-link text-dark" to="/dashboard">สถิติ</Link>
          <Link className="nav-link text-dark" to="#">ประเภทสินค้า</Link>
          <Link className="nav-link text-dark" to="/product">สินค้าหน้าร้าน</Link>

          {/* Accordion: คลังวัตถุดิบ */}
          <div className="accordion" id="accordionExample">
            <div className="accordion-item border-0">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMaterials" aria-expanded="true" aria-controls="collapseMaterials">คลังวัตถุดิบ</button>
              </h2>
              <div id="collapseMaterials" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <Link className="nav-link text-dark" to="/material">วัตถุดิบ</Link>
                  <Link className="nav-link text-dark" to="#">บรรจุภัณฑ์</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion: การสั่งซื้อ */}
          <div className="accordion" id="accordionOrders">
            <div className="accordion-item border-0">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOrders" aria-expanded="false" aria-controls="collapseOrders">การสั่งซื้อ</button>
              </h2>
              <div id="collapseOrders" className="accordion-collapse collapse" data-bs-parent="#accordionOrders">
                <div className="accordion-body">
                  <Link className="nav-link text-dark" to="#">รายการการสั่งซื้อ</Link>
                  <Link className="nav-link text-dark" to="#">ประวัติการสั่งซื้อ</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Offcanvas สำหรับหน้าจอเล็ก */}
      <div className={`offcanvas offcanvas-start ${show ? 'show' : ''}`} tabIndex="-1" id="offcanvasSidebar" style={{width: '60vw'}}>
        <div className="offcanvas-header">
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setShow(false)}></button>
        </div>
        <div className="offcanvas-body">
          <nav className="nav flex-column">
            <Link className="nav-link text-dark" to="/dashboard">สถิติ</Link>
            <Link className="nav-link text-dark" to="#">ประเภทสินค้า</Link>
            <Link className="nav-link text-dark" to="/product">สินค้าหน้าร้าน</Link>

            {/* Accordion: คลังวัตถุดิบ */}
            <div className="accordion" id="accordionExampleMobile">
              <div className="accordion-item border-0">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMaterialsMobile" aria-expanded="true" aria-controls="collapseMaterialsMobile">คลังวัตถุดิบ</button>
                </h2>
                <div id="collapseMaterialsMobile" className="accordion-collapse collapse" data-bs-parent="#accordionExampleMobile">
                  <div className="accordion-body">
                    <Link className="nav-link text-dark" to="/material">วัตถุดิบ</Link>
                    <Link className="nav-link text-dark" to="#">บรรจุภัณฑ์</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion: การสั่งซื้อ */}
            <div className="accordion" id="accordionOrdersMobile">
              <div className="accordion-item border-0">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOrdersMobile" aria-expanded="false" aria-controls="collapseOrdersMobile">การสั่งซื้อ</button>
                </h2>
                <div id="collapseOrdersMobile" className="accordion-collapse collapse" data-bs-parent="#accordionOrdersMobile">
                  <div className="accordion-body">
                    <Link className="nav-link text-dark" to="#">รายการการสั่งซื้อ</Link>
                    <Link className="nav-link text-dark" to="#">ประวัติการสั่งซื้อ</Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Sidebaradmin;