import React, { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { getCartService, getPorductCartService } from "../../../../API/customer/productService";
import { getCategoryService } from "../../../../API/customer/productService"
import { logout } from "../../../../API/authService";
import { useCart } from "./CartContext";
import SearchShowList from '../../../untils/fucntion/searchShowList';

const Navbar = memo(() => {
  const [productCart, setProductCart] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [totalPriceCart, setTotalPriceCrat] = useState(0);
  const [cartId, setCartId] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalPrice } = useCart();
  const [productsSearch, setProductsSearch] = useState([]);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const fechData = async () => {
      try {
        const [
          getCart,
          getPorductCart,
          getCategory,
        ] = await Promise.all([
          getCartService(),
          getPorductCartService(),
          getCategoryService(),
        ])
        console.log(getCategory);
        
        setCartId(getCart.data[0].cartId);
        setProductCart(getPorductCart.data);
        setCategoryList(getCategory.data)
      } catch (error) {
        alert(error);
      }
    };
    fechData();
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
        {/* //! หน้าจอใหญ่ */}
        <nav className="navbar navbar-expand-lg navbar-light d-none d-lg-block">
          <div className="container-fluid">
            <form className="d-flex flex-grow-1 ">
              < SearchShowList name="ค้นหา" itemKeys={["product_name"]} />
            </form>
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
                <button className="btn btn-outline text-white rounded-pill mx-1">ติดต่อสอบถาม</button>
              </div>
            )}
            <div className="text-end d-flex justify-content-center">
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
        {/* //! หน้าจอเล็ก */}
        <nav className="d-block d-lg-none navbar container-fluid d-flex align-items-start p-0 mt-2" style={{ backgroundColor: '#C40C0C', height: "50px" }}> {/* align-items-start ทำให้ของอยู่บนสุดช่วยจัดให้ดูสวยงาม */}
          <Link className="btn btn-outline-light bi bi-house-door-fill" to="/home"></Link>
          <div className="flex-grow-1 me-2 ms-2">
            <SearchShowList name="ค้นหา" itemKeys={["product_name"]} />
          </div>
          <Link className="btn btn-outline-light d-flex align-items-center" to={`/cart/${cartId}`} style={{ borderRadius: '20px' }}>
            <i className="bi bi-cart3 ms-1"></i>
            <span className="small">฿ {totalPriceCart}</span>
          </Link>
        </nav>
      </div>
      {/* Navbar ส่วนล่าง */}
      {!isScrolled && (
        <div className="container text-center my-4 d-none d-lg-block">
          <img src="../../../../src/assets/LogoCN1.PNG" alt="Bakery Cookie New Happy Family" style={{ width: "150px" }} />
          <nav className="container text-center col-9 mt-3 border rounded-pill p-1 border-dark" style={{ backgroundColor: "#C40C0C" }}>
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
            <button className="btn btn-outline text-white rounded-pill mx-1">ติดต่อสอบถาม</button>
          </nav>
        </div>
      )}
    </div>
  );
})

export default Navbar;