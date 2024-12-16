import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategoryService } from '../../../../API/guest/guestProductService'
import SearchShowListGuest from '../../../untils/fucntion/searchShowListGuest';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
    useEffect(() => {
      const fechData = async () => {
        try {
          const [        
            getCategory,
          ] = await Promise.all([
            getCategoryService(),
          ])
          // console.log(getListProduct.data);
          setCategoryList(getCategory.data)
        } catch (error) {
          alert(error);
        }
      };
      fechData();
    }, []);
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
      <div className="p-1 mb-2 text-dark" style={{ backgroundColor: "#C40C0C", height: "65px" }}>
        <nav className="navbar navbar-expand-lg navbar-light d-none d-xl-block">
          <div className="container-fluid">
            <form className="d-flex flex-grow-1">
            < SearchShowListGuest name="Search" itemKeys={["product_name"]} />
            </form>
            <div className="text-end d-flex justify-content-center">
            {isScrolled && (
              <div className="d-flex justify-content-center align-items-center ">
                <button className="btn btn-outline text-white rounded-pill mx-1"><Link className="dropdown-item" to="/">หน้าหลัก</Link></button>
                <div className="dropdown d-inline">
                  <button type="button" className="btn btn-outline text-white rounded-pill mx-1" data-bs-toggle="dropdown" aria-expanded="false">หมวดหมู่</button>
                  <ul className="dropdown-menu mt-2" aria-labelledby="dropdownMenuButton1">
                    {categoryList.map((item, index)=>(
                      <li key={index}><Link className="dropdown-item" to={`/list/category/product/`+ item.category_name} onClick={location.reload}>{item.category_name}</Link></li>
                    ))}
                  </ul>
                </div>
                <button className="btn btn-outline text-white rounded-pill mx-1">ขั้นตอนการสั่งซื้อ</button>
                <button className="btn btn-outline text-white rounded-pill mx-1">ติดต่อสอบถาม</button>
              </div>
            )}
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item"><Link className="nav-link active text-light" aria-current="page" to="/login">เข้าสู่ระบบ</Link></li>
                  <i className="bi bi-dash-lg fs-3 text-black d-none d-lg-inline" style={{ transform: "rotate(90deg)" }}></i>
                  <li className="nav-item"><Link className="nav-link active text-light" aria-current="page" to="/signup">สมัครสมาชิก</Link></li>
                  <li className="nav-item"><Link className="nav-link active text-light" to="#">฿ 0.00</Link></li>
                  <li className="nav-item"><i className="bi bi-basket3 fs-3 text-light"></i></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <nav className="d-block d-xl-none navbar container-fluid d-flex align-items-start p-0 mt-2" style={{ backgroundColor: '#C40C0C', height: "50px" }}> {/* align-items-start ทำให้ของอยู่บนสุดช่วยจัดให้ดูสวยงาม */}
          <Link className="btn btn-outline-light bi bi-house-door-fill" to="/"></Link>
          <div className="flex-grow-1 me-2 ms-2">
            <SearchShowListGuest name="ค้นหา" itemKeys={["product_name"]} />
          </div>
        </nav>
      </div>
      {/* Navbar ส่วนล่าง */}
      {!isScrolled && (
        <div className="container text-center my-4 d-none d-lg-block">
          <img src="https://example.com/logo.png" alt="Bakery Cookie New Happy Family" style={{ width: "150px" }} />
          <nav className="container text-center col-9 mt-3 border rounded-pill p-1 border-dark" style={{ backgroundColor: "#C40C0C" }}>
            <Link className="btn btn-outline text-white rounded-pill mx-1" to="/">หน้าหลัก</Link>
            <div className="dropdown d-inline">
              <button type="button" className="btn btn-outline text-white rounded-pill mx-1" data-bs-toggle="dropdown" aria-expanded="false">หมวดหมู่</button>
              <ul className="dropdown-menu mt-2" aria-labelledby="dropdownMenuButton1">
                {categoryList.map((item, index)=>(
                  <li key={index}><Link className="dropdown-item" to={`/list/category/product/`+ item.category_name} onClick={location.reload}>{item.category_name}</Link></li>
                ))}
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