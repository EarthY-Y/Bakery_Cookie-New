import React from 'react';
import { Link } from 'react-router-dom';
function Sidebar() {
  return (
  <div className="d-flex justify-content-center mt-4">
      <div className="card" style={{ width: "300px", borderRadius: "8px" }}>
        {/* ส่วนของโปรไฟล์ */}
        <div className="card-body">
          <nav className="nav flex-column navbar-expand-lg">
            <Link className="nav-link text-dark" to="/profile">บัญชีของฉัน</Link>
            <Link className="nav-link text-dark" to="">ข้อมูลที่อยู่</Link>
            <Link className="nav-link text-dark" to="">ติดตามคำสั่งซื้อ</Link>
            <Link className="nav-link text-dark" to="">ประวัติการสั่งซื้อ</Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
