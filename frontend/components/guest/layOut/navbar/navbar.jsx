import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`navbar-container ${isScrolled ? "scrolled" : ""}`}>
      <div className="p-1 mb-2 text-dark" style={{ backgroundColor: "#C40C0C" }}>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <form className="d-flex flex-grow-1">
              <input className="form-control me-2" style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }} type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-light" type="submit"><i className="bi bi-search"></i></button>
            </form>
            <div className="text-end">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item"><Link className="nav-link active text-light" aria-current="page" to="/Login">เข้าสู่ระบบ</Link></li>
                  <i className="bi bi-dash-lg fs-3 text-black d-none d-lg-inline" style={{ transform: "rotate(90deg)" }}></i>
                  <li className="nav-item"><Link className="nav-link active text-light" aria-current="page" to="/signup">สมัครสมาชิก</Link></li>
                  <li className="nav-item"><Link className="nav-link active text-light" to="#">฿ 0.00</Link></li>
                  <li className="nav-item"><i className="bi bi-basket3 fs-3 text-light"></i></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        {isScrolled && (
          <div className="d-flex justify-content-center align-items-center mt-2">
            <button className="btn btn-outline text-white rounded-pill mx-1">หน้าหลัก</button>
            <div className="dropdown d-inline">
              <button type="button" className="btn btn-outline text-white rounded-pill mx-1" data-bs-toggle="dropdown" aria-expanded="false">หมวดหมู่</button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="#">เค้ก</Link></li>
                <li><Link className="dropdown-item" to="#">คุกกี้</Link></li>
                <li><Link className="dropdown-item" to="#">ขนมปัง</Link></li>
                <li><Link className="dropdown-item" to="#">Separated link</Link></li>
              </ul>
            </div>
            <button className="btn btn-outline text-white rounded-pill mx-1">ขั้นตอนการสั่งซื้อ</button>
            <button className="btn btn-outline text-white rounded-pill mx-1">ติดต่อสอบถาม</button>
          </div>
        )}
      </div>
      {!isScrolled && (
        <div className="container text-center my-4">
          <img src="https://example.com/logo.png" alt="Bakery Cookie New Happy Family" style={{ width: "150px" }} />
          <nav className="container text-center col-5 mt-3 border rounded-pill p-1 border-dark" style={{ backgroundColor: "#C40C0C" }}>
            <button className="btn btn-outline text-white rounded-pill mx-1">หน้าหลัก</button>
            <div className="dropdown d-inline">
              <button type="button" className="btn btn-outline text-white rounded-pill mx-1" data-bs-toggle="dropdown" aria-expanded="false">หมวดหมู่</button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="#">เค้ก</Link></li>
                <li><Link className="dropdown-item" to="#">คุกกี้</Link></li>
                <li><Link className="dropdown-item" to="#">ขนมปัง</Link></li>
                <li><Link className="dropdown-item" to="#">Separated link</Link></li>
              </ul>
            </div>
            <button className="btn btn-outline text-white rounded-pill mx-1">ขั้นตอนการสั่งซื้อ</button>
            <button className="btn btn-outline text-white rounded-pill mx-1">ติดต่อสอบถาม</button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;