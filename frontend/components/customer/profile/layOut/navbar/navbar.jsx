import React, { useState, useEffect } from 'react'
import { Link, NavLink } from "react-router-dom"
import { getCartService, getPorductCartService } from '../../../../../API/customer/productService';
import { getCategoryService } from "../../../../../API/customer/productService"
import { getProfileCustomerService } from "../../../../../API/customer/customerService";
import { logout } from '../../../../../API/authService';
import SearchShowList from '../../../../untils/fucntion/searchShowList';
import { numberGrouping } from '../../../../untils/frommatters/numberFormatting';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

function Navbar() {
  const [productCart, setproductCart] = useState([])
  const [categoryList, setCategoryList] = useState([]);
  const [proflieCustomer, setProflieCustomer] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartId, setCartId] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [productsSearch, setProductsSearch] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          getCart,
          getProductCart,
          getCategory,
          getProfileCustomer,
        ] = await Promise.all([
          getCartService(),
          getPorductCartService(),
          getCategoryService(),
          getProfileCustomerService(),
        ])
        // console.log(getListProduct.data);
        setCartId(getCart.data[0].cartId)
        setproductCart(getProductCart.data)
        setCategoryList(getCategory.data || [])
        setProflieCustomer(getProfileCustomer.data[0])
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  const calculateTotalPrice = () => {
    const total = productCart.reduce((sum, item) => sum + item.selling_price_per_quantity * item.quantity, 0);
    setTotalPrice(total); // อัปเดตราคารวม
  };

  useEffect(() => {
    calculateTotalPrice(); // คำนวณราคาทันทีเมื่อรายการสินค้าเปลี่ยน
  }, [productCart, totalPrice]);

  /*  มากกว่าเป็น true น้อยกว่าเป็น false */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout()
    location.reload()
  }
  return (
    <div> {/* เปลี่ยนพื้นหลังคอนเทนต์หลัก */}
      {/* Navbar ส่วนบน */}
      <div className={`p-1 mb-2 text-dark ${isScrolled ? "scrolled-navbar" : ""}`} style={{ backgroundColor: "#C40C0C" }}>
        <nav className="navbar navbar-expand-lg navbar-light d-none d-lg-block">
          <div className="container-fluid">
            <form className="d-flex flex-grow-1">
              < SearchShowList name="ค้นหา" itemKeys={["product_name"]} />
            </form>
            <div className="text-end d-flex justify-content-center">
              {isScrolled && ( /*  มากกว่าเป็น true น้อยกว่าเป็น false */
                <div className="align-items-center">
                  <Link className="btn btn-outline text-white rounded-pill mx-1" to="/home">หน้าหลัก</Link>
                  <div className="dropdown d-inline">
                    <button type="button" className="btn btn-outline text-white rounded-pill mx-1" data-bs-toggle="dropdown" aria-expanded="false">หมวดหมู่</button>
                    {categoryList.length !== 0 ? (
                      <><ul className="dropdown-menu mt-2" aria-labelledby="dropdownMenuButton1">
                        {categoryList.map((item, index) => (
                          <li key={index}><Link className="dropdown-item" to={`/category/` + item.category_name} >{item.category_name}</Link></li>
                        ))}
                      </ul>
                      </>
                    ) : ("")}
                  </div>
                  <Link className="btn btn-outline text-white rounded-pill mx-1" to="/userManual">ขั้นตอนการสั่งซื้อ</Link>
                  <Link className="btn btn-outline text-white rounded-pill mx-1" to="/contact">ติดต่อสอบถาม</Link>
                </div>
              )}
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active text-light" to={`/cart/${cartId}`}>฿ {numberGrouping(totalPrice)}</Link>
                  </li>
                  <li className="nav-item">
                    <i className="bi bi-basket3 fs-3 text-light me-3"></i>
                  </li>
                  <li className="nav-item dropdown ms-auto d-flex align-items-start position-relative">
                    <button className="btn dropdown-toggle d-flex align-items-center caret-off w-100 mb-2" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: "1.5px solid #000", borderRadius: "10px", backgroundColor: "transparent", color: "#FFFFFF" }}>
                      <img src={API_URL_PICTURE + proflieCustomer.customerpic} alt="" className="mb-0" style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px" }} />
                      <span>{proflieCustomer.username}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-start mt-0 w-100" aria-labelledby="profileDropdown" style={{ minWidth: "unset" }}>
                      <li><Link className="dropdown-item" to="/profile">บัญชีของฉัน</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button type="button" className="dropdown-item btn" onClick={handleLogout}>ออกจากระบบ</button></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Navbar หน้าจอเล็ก */}
        <nav className="d-block d-lg-none navbar px-3 py-2" style={{ backgroundColor: '#C40C0C', width: "100%", borderRadius: "10px" }}>
          <div className="row align-items-center">
            {/* Home Button */}
            <div className="col-auto">
              <Link className="btn btn-outline-light bi bi-house-door-fill d-flex align-items-center" to="/home"></Link>
            </div>

            {/* Search Bar */}
            <div className="col mt-3">
              <SearchShowList name="ค้นหา" itemKeys={["product_name"]} />
            </div>

            {/* Cart Button */}
            <div className="col-auto">
              <Link className="btn btn-outline-light d-flex align-items-center px-3" to={`/cart/${cartId}`} style={{ borderRadius: '20px' }}>
                <i className="bi bi-cart3 me-1"></i>
                <span className="small">฿ {numberGrouping(totalPrice)}</span>
              </Link>
            </div>
          </div>
        </nav>

      </div>
      {/* Navbar ส่วนล่าง */}
      {!isScrolled && (
        <div className="container text-center my-4 d-none d-lg-block">
          <img
            src="../../../../../src/assets/LogoCN1.PNG" // เปลี่ยน URL เป็นโลโก้ของคุณ
            alt="Bakery Cookie New Happy Family"
            style={{ width: '150px' }}
          />
          <nav className="container text-center col-9 mt-3 border rounded-pill p-1 border-dark" style={{ backgroundColor: '#C40C0C' }}>
            <Link className="btn btn-outline text-white rounded-pill mx-1" to="/home">หน้าหลัก</Link>

            {/* Dropdown menu สำหรับหมวดหมู่ */}
            <div className="dropdown d-inline">
              <button type="button" className="btn btn-outline text-white rounded-pill mx-1 " data-bs-toggle="dropdown" aria-expanded="false" >หมวดหมู่</button>
              {categoryList.length !== 0 ? (
                <><ul className="dropdown-menu mt-2" aria-labelledby="dropdownMenuButton1">
                  {categoryList.map((item, index) => (
                    <li key={index}><Link className="dropdown-item" to={`/category/` + item.category_name}>{item.category_name}</Link></li>
                  ))}
                </ul>
                </>
              ) : ("")}
            </div>

            <Link className="btn btn-outline text-white rounded-pill mx-1" to="/userManual">ขั้นตอนการสั่งซื้อ</Link>
            <Link className="btn btn-outline text-white rounded-pill mx-1" to="/contact">ติดต่อสอบถาม</Link>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Navbar
