import React, { useState, useEffect } from 'react'
import { Link, NavLink } from "react-router-dom"
import { getCartService, getPorductCartService } from '../../../../../API/customer/productService';
import { getCategoryService } from "../../../../../API/customer/productService"
import { getProfileCustomerService } from "../../../../../API/customer/customerService";
import { logout } from '../../../../../API/authService';
import SearchShowList from '../../../../untils/fucntion/searchShowList';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_LOGO

const API_URL_PICTUREPROFILE = import.meta.env.VITE_API_Port_PICTURE_PROFILE

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
        setCategoryList(getCategory.data)
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
      setIsScrolled(window.scrollY > 0);
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
                    <ul className="dropdown-menu mt-2">
                      {categoryList.map((item, index)=>(
                        <li key={index}><Link className="dropdown-item" to={`/category/`+ item.category_name} onClick={location.reload}>{item.category_name}</Link></li>
                      ))}
                  </ul>
                  </div>
                  <button className="btn btn-outline text-white rounded-pill mx-1">ขั้นตอนการสั่งซื้อ</button>
                  <Link className="btn btn-outline text-white rounded-pill mx-1" to="/contact">ติดต่อสอบถาม</Link>
                </div>
              )}
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active text-light" to={`/cart/${cartId}`}>฿ {totalPrice}</Link>
                  </li>
                  <li className="nav-item">
                    <i className="bi bi-basket3 fs-3 text-light me-3"></i>
                  </li>
                  <li className="nav-item dropdown ms-auto d-flex align-items-start position-relative">
                    <button className="btn dropdown-toggle d-flex align-items-center caret-off mb-0" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: "1.5px solid #000", borderRadius: "10px", backgroundColor: "transparent", color: "#FFFFFF" }}>
                      <img src={API_URL_PICTUREPROFILE + proflieCustomer.customerpic} alt="" className="mb-0" style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px" }} />
                      <span>{proflieCustomer.username}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-start mt-0" aria-labelledby="profileDropdown">
                      <li><Link className="dropdown-item" to="/profile">โปรไฟล์ของฉัน</Link></li>
                      {/* <li><Link className="dropdown-item" to="/settings">การตั้งค่า</Link></li> */}
                      <li><hr className="dropdown-divider" /></li>
                      <li><button type="button" className="dropdown-item btn" onClick={handleLogout}>ออกจากระบบ</button></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <nav className="d-block d-lg-none navbar container-fluid d-flex align-items-start mt-2 mb-2" style={{ backgroundColor: '#C40C0C', height: "50px" }}> {/* align-items-start ทำให้ของอยู่บนสุดช่วยจัดให้ดูสวยงาม */}
          <Link className="btn btn-outline-light bi bi-house-door-fill" to="/home"></Link>
          <div className="flex-grow-1 me-2 ms-2">
            <SearchShowList name="ค้นหา" itemKeys={["product_name"]} />
          </div>
          <Link className="btn btn-outline-light d-flex align-items-center" to={`/cart/${cartId}`} style={{ borderRadius: '20px' }}>
            <i className="bi bi-cart3 ms-1"></i>
            <span className="small">฿ {totalPrice}</span>
          </Link>
        </nav>
      </div>
      {/* Navbar ส่วนล่าง */}
      {!isScrolled && (
        <div className="container text-center my-4 d-none d-lg-block">
          <img src={API_URL_PICTUREPROFILE + "LogoCN1.PNG"} alt="Bakery Cookie New Happy Family" style={{ width: '150px' }}/>
          <nav className="container text-center col-9 mt-3 border rounded-pill p-1 border-dark" style={{ backgroundColor: '#C40C0C' }}>
            <Link className="btn btn-outline text-white rounded-pill mx-1" to="/home">หน้าหลัก</Link>
            {/* Dropdown menu สำหรับหมวดหมู่ */}
            <div className="dropdown d-inline">
              <button type="button" className="btn btn-outline text-white rounded-pill mx-1 " data-bs-toggle="dropdown" aria-expanded="false" >หมวดหมู่</button>
              <ul className="dropdown-menu mt-2" aria-labelledby="dropdownMenuButton1">
                {categoryList.map((item, index)=>(
                  <li key={index}><Link className="dropdown-item" to={`/category/`+ item.category_name} onClick={location.reload}>{item.category_name}</Link></li>
                ))}
              </ul>
            </div>

            <button className="btn btn-outline text-white rounded-pill mx-1">ขั้นตอนการสั่งซื้อ</button>
            <Link className="btn btn-outline text-white rounded-pill mx-1" to="/contact">ติดต่อสอบถาม</Link>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Navbar
