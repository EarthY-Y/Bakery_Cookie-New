import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { getCartService, getPorductCartService } from "../../../../API/customer/productService";
import { logout } from "../../../../API/authService";
import { useCart } from "./CartContext";

const Navbar = memo(() => { 
  const [productCart, setProductCart] = useState([]);
  const [totalPriceCart, setTotalPriceCrat] = useState(0);
  const [cartId, setCartId] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalPrice } = useCart();
  
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await getCartService();
        if (!response.data) throw new Error("ไม่มีข้อมูล");
        setCartId(response.data[0].cartId);
      } catch (error) {
        alert(error);
      }
    };
    getCart();
  }, []);

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await getPorductCartService();
        if (!response.data) throw new Error("ไม่มีข้อมูล");
        setProductCart(response.data);
      } catch (error) {
        alert(error);
      }
    };
    getCartItems();
  }, []);

  useEffect(() => {
    const total = productCart.reduce((sum, item) => sum + item.selling_price_per_quantity * item.quantity, 0);
    console.log(totalPrice, total);
    const totalCart = total + parseInt(totalPrice || 0)
    setTotalPriceCrat(totalCart);
  }, [productCart, totalPrice]);

  /*  มากกว่าเป็น true น้อยกว่าเป็น false */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Navbar ส่วนบน */}
      <div className={`p-1 mb-2 text-dark ${isScrolled ? "scrolled-navbar" : ""}`} style={{ backgroundColor: "#C40C0C" }}>
      <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid"> {/* หน้าจอใหญ่ */}
            <form className="d-flex flex-grow-1">
              <input className="form-control me-2" style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }} type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-light" type="submit"><i className="bi bi-search"></i></button>
            </form>
            <div className="text-end d-flex justify-content-center">
            {isScrolled && ( /*  มากกว่าเป็น true น้อยกว่าเป็น false */
              <div className="align-items-center">
                <Link className="btn btn-outline text-white rounded-pill mx-1" to="/home">หน้าหลัก</Link>
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
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active text-light" to={`/cart/${cartId}`}>฿ {totalPriceCart}</Link>
                  </li>
                  <li className="nav-item">
                    <i className="bi bi-basket3 fs-3 text-light me-3"></i>
                  </li>
                  <li className="nav-item dropdown ms-auto d-flex align-items-center position-relative">
                    <button className="btn d-flex align-items-center caret-off mb-0" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: "1.5px solid #000", borderRadius: "10px", backgroundColor: "transparent", color: "#FFFFFF" }}>
                      <img src="https://example.com/profile.jpg" alt="Profile" className="mb-0" style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px" }} />
                      <span>ชื่อโปรไฟล์</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end mt-0" aria-labelledby="profileDropdown">
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
        
      </div>
      {/* Navbar ส่วนล่าง */}
      {!isScrolled && (
        <div className="container text-center my-4">
          <img src="https://example.com/logo.png" alt="Bakery Cookie New Happy Family" style={{ width: "150px" }} />
          <nav className="container text-center col-9 mt-3 border rounded-pill p-1 border-dark" style={{ backgroundColor: "#C40C0C" }}>
            <Link className="btn btn-outline text-white rounded-pill mx-1" to="/home">หน้าหลัก</Link>
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
})

export default Navbar;