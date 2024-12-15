import React from 'react';
import { Link } from 'react-router-dom';
function Sidebar() {
  return (
    <div className="d-flex justify-content-center mt-3"> 
      {/* หน้าจอใหญ่ */}
      <div className="card border-0 shadow-sm d-none d-lg-block" style={{ width: "300px", borderRadius: "8px" }}>
        <div className="card-body">
          <nav className="nav flex-column navbar-expand-lg">
            <Link className="nav-link text-dark" to="/profile">บัญชีของฉัน</Link>
            <Link className="nav-link text-dark" to="/profile/customer/address">ข้อมูลที่อยู่</Link>
            <Link className="nav-link text-dark" to="/profile/orderTracking">ติดตามคำสั่งซื้อ</Link>
            <Link className="nav-link text-dark" to="/profile/orderHistory">ประวัติการสั่งซื้อ</Link>
          </nav>
        </div>
      </div>

      {/* หน้าจอเล็ก */}
      <div className="border-0 d-block d-lg-none" > {/* style={{ whiteSpace: "nowrap" }} ทำให้คำไม่ตก */}
        {/* ส่วนของโปรไฟล์ */}
        <div className="row text-center">
          <Link className="text-dark text-decoration-none col-3" to="/profile">
            <i className="bi bi-person-circle fs-4"></i>
            <p className="small">บัญชี</p>
          </Link>
          <Link className="text-dark text-decoration-none col-3" to="/profile/customer/address">
            <i className="bi bi-geo-alt fs-4"></i>
            <p className="small">ที่อยู่</p>
          </Link>
          <Link className="text-dark text-decoration-none col-3" to="/profile/orderTracking">
            <i className="bi bi-truck fs-4"></i>
            <p className="small">คำสั่งซื้อ</p>
          </Link>
          <Link className="text-dark text-decoration-none col-3" to="/profile/orderHistory">
            <i className="bi bi-clock-history fs-4"></i>
            <p className="small">ประวัติการซื้อ</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
