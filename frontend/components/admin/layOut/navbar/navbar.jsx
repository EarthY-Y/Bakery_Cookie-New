import React from 'react'
// import reactLogo from '../../../../src/assets/react.svg '
// import viteLogo from '../../../public/vite.svg'  
// import '../../../../src/App.css'
import { NavLink } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaArrowRight } from 'react-icons/fa';

function navbar() {
  return (
    <div class="p-1 mb-2 text-dark" style={{ backgroundColor: '#C40C0C'}}>
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
                <a className="nav-link active text-light" aria-current="page" href="#">เข้าสู่ระบบ</a>
              </li>
              <i className="bi bi-dash-lg fs-3 text-black" style={{ transform: 'rotate(90deg)' }}></i>
              <li className="nav-item">
                <a className="nav-link active text-light" aria-current="page" href="dashboard/product">สมัครสมาชิก</a>
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
  )
}

export default navbar
