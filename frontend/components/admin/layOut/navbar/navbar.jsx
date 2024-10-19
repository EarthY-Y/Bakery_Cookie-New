import React from 'react'
import { NavLink } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaArrowRight } from 'react-icons/fa';

function navbar() {
  return (
    <div>
    <div className="p-1 mb-2 text-dark" style={{ backgroundColor: '#C40C0C'}}>
      <nav className="navbar navbar-expand-lg navbar-light " >
        <div className="container-fluid" >
        <form className="d-flex">
              <input className="form-control me-2" style={{ width: '400px', borderRadius: '10px' }} type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-light" type="submit"><i className="bi bi-search"></i></button>
            </form>
         <div className='col-md-3 text-end'>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active text-light" aria-current="page" href="Login">เข้าสู่ระบบ</a>
              </li>
              <i className="bi bi-dash-lg fs-3 text-black" style={{ transform: 'rotate(90deg)' }}></i>
              <li className="nav-item">
                <a className="nav-link active text-light" aria-current="page" href="/signup">สมัครสมาชิก</a>
                {/* <NavLink to = {"/product"}>product</NavLink> */}
              </li>
              <li className="nav-item">
                <a className="nav-link active text-light" aria-current="page" href="#">฿ 0.00</a>
              </li>
              <i className="bi bi-alarm fs-3 bi-basket3 text-light"></i>
            </ul>
          </div>
          </div>
        </div>
      </nav>
      </div>
      <div className="container text-center my-4">
        <img
          src="https://example.com/logo.png" // เปลี่ยน URL เป็นโลโก้ของคุณ
          alt="Bakery Cookie New Happy Family"
          style={{ width: '150px' }}
        />
        <nav className="container text-center col-5 mt-3 border rounded-pill p-1 border-dark"style={{ backgroundColor: '#C40C0C'}}>
          <button className="btn btn-outline text-white rounded-pill mx-1">หน้าหลัก</button>
          <button className="btn btn-warning rounded-pill mx-1">หมวดหมู่</button>
          <button className="btn btn-outline text-white rounded-pill mx-1">ขั้นตอนการสั่งซื้อ</button>
          <button className="btn btn-outline text-white rounded-pill mx-1">ติดต่อสอบถาม</button>
        </nav>
      </div>
    </div>
  )
}

export default navbar
