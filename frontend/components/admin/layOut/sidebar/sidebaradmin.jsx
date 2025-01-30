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
      <nav className="navbar navbar-light mb-3 d-lg-none p-1" >
        <button className="navbar-toggler" type="button" aria-label="Toggle navigation" onClick={toggleOffcanvas}>
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>

      {/* Sidebar สำหรับหน้าจอใหญ่ อธิบาย d-lg-block อยู่ในหมวด display ใช้ ซ่อนหรือโชว์ element ในขน้าหน้าจอต่างๆ*/}
      <div className="d-none d-lg-block bg-light p-3 col-2 min-vh-100 shadow overflow-y-auto" style={{height: '100vh', position: 'fixed' }}>
        <nav className="nav flex-column navbar-expand-lg " style={{marginBottom: '70px'}}>
          <Link className="nav-link text-dark" to="/dashboard">สถิติ</Link>
          <Link className="nav-link text-dark" to="/product">สินค้าหน้าร้าน</Link>
          <div className="accordion mt-2 shadow-sm" id="accordionExample">
            <div className="accordion-item border-0">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed explan" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCategory" aria-expanded="true" aria-controls="collapseCategory">ประเภท</button>
              </h2>
              <div id="collapseCategory" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <Link className="nav-link text-dark" to="/category/prduct">ประเภทสินค้า</Link>
                  <Link className="nav-link text-dark" to="/category/package">ประเภทบรรจุภัณฑ์</Link>
                  <Link className="nav-link text-dark" to="/category/statusOrder">ประเภทสถานะคำสั่งซื้อ</Link>
                </div>
              </div>
            </div>
          </div>
          {/* Accordion: คลังวัตถุดิบ */}
          <div className="accordion mt-2 shadow-sm" id="accordionExample">
            <div className="accordion-item border-0">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed explan" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMaterials" aria-expanded="true" aria-controls="collapseMaterials">คลังวัตถุดิบ</button>
              </h2>
              <div id="collapseMaterials" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <Link className="nav-link text-dark" to="/material">วัตถุดิบ</Link>
                  <Link className="nav-link text-dark" to="/package">บรรจุภัณฑ์</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion: การสั่งซื้อ */}
          <div className="accordion mt-2 shadow-sm" id="accordionOrders">
            <div className="accordion-item border-0">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOrders" aria-expanded="false" aria-controls="collapseOrders">การสั่งซื้อ</button>
              </h2>
              <div id="collapseOrders" className="accordion-collapse collapse show" data-bs-parent="#accordionOrders">
                <div className="accordion-body">
                  <Link className="nav-link text-dark" to="/orderslist">รายการการสั่งซื้อ</Link>
                  <Link className="nav-link text-dark" to="/ordershistory">ประวัติการสั่งซื้อ</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion mt-2 shadow-sm" id="accordionAnother">
            <div className="accordion-item border-0">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAnother" aria-expanded="false" aria-controls="collapseAnother">สถานะ</button>
              </h2>
              <div id="collapseAnother" className="accordion-collapse collapse show" data-bs-parent="#accordionAnother">
                <div className="accordion-body">
                  <Link className="nav-link text-dark" to="/status/orders">สถานะของคำสั่งซื้อ</Link>
                  <Link className="nav-link text-dark" to="/status/cart">สถานะของตะกร้าสินค้า</Link>
                </div>
              </div>
            </div>
          </div>
          <Link className="nav-link text-dark" to="/shipping">ขนส่ง</Link> 
          <Link className="nav-link text-dark" to="/manager/customer">จัดการลูกค้า</Link>
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
            <Link className="nav-link text-dark" to="/product">สินค้าหน้าร้าน</Link>
            <div className="accordion mt-2 shadow-sm" id="accordionExample">
            <div className="accordion-item border-0">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed explan" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCategory" aria-expanded="true" aria-controls="collapseCategory">ประเภท</button>
              </h2>
              <div id="collapseCategory" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <Link className="nav-link text-dark" to="/category/prduct">ประเภทสินค้า</Link>
                  <Link className="nav-link text-dark" to="/category/package">ประเภทบรรจุภัณฑ์</Link>
                  <Link className="nav-link text-dark" to="/category/statusOrder">ประเภทสถานะคำสั่งซื้อ</Link>
                </div>
              </div>
            </div>
          </div>

            {/* Accordion: คลังวัตถุดิบ */}
            <div className="accordion" id="accordionExampleMobile">
              <div className="accordion-item border-0">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMaterialsMobile" aria-expanded="true" aria-controls="collapseMaterialsMobile">คลังวัตถุดิบ</button>
                </h2>
                <div id="collapseMaterialsMobile" className="accordion-collapse collapse" data-bs-parent="#accordionExampleMobile">
                  <div className="accordion-body">
                    <Link className="nav-link text-dark" to="/material">วัตถุดิบ</Link>
                    <Link className="nav-link text-dark" to="/package">บรรจุภัณฑ์</Link>
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
                    <Link className="nav-link text-dark" to="/orderslist">รายการการสั่งซื้อ</Link>
                    <Link className="nav-link text-dark" to="/ordershistory">ประวัติการสั่งซื้อ</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion" id="accordionAnotherMobile">
              <div className="accordion-item border-0">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAnotherMobile" aria-expanded="false" aria-controls="collapseAnotherMobile">สถานะ</button>
                </h2>
                <div id="collapseAnotherMobile" className="accordion-collapse collapse" data-bs-parent="#accordionAnotherMobile">
                  <div className="accordion-body">
                    <Link className="nav-link text-dark" to="/category/prduct">ประเภทสินค้า</Link>
                    <Link className="nav-link text-dark" to="/category/package">ประเภทบรรจุภัณฑ์</Link>
                  </div>
                </div>
              </div>
            </div>
            <Link className="nav-link text-dark" to="/shipping">ขนส่ง</Link>
            <Link className="nav-link text-dark" to="/manager/customer">จัดการลูกค้า</Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Sidebaradmin;