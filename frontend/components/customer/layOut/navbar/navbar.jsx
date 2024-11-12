import React, {useState, useEffect} from 'react'
import { Link, NavLink } from "react-router-dom"
import { getCartService, getPorductCartService } from '../../../../API/customer/productService';
import { logout } from '../../../../API/authService';

function Navbar() {
  const [productCart, setproductCart] = useState([])
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartId, setCartId] = useState(0);
  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    const getCart = async()=> {
      try {
        const response = await getCartService()
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        setCartId(response.data[0].cartId)
      }
      
      catch (error) {
        alert(error)
      }
    }
    getCart()
  },[])

  useEffect(() => {
    const getCart = async()=> {
      try {
        const response = await getPorductCartService()
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        setproductCart(response.data)
      }
      
      catch (error) {
        alert(error)
      }
    }
    getCart()
  },[])

  const calculateTotalPrice = () => {
    const total = productCart.reduce((sum, item) => sum + item.selling_price_per_quantity * item.quantity, 0); 
    setTotalPrice(total); // อัปเดตราคารวม
  };

  useEffect(() => {
    calculateTotalPrice(); // คำนวณราคาทันทีเมื่อรายการสินค้าเปลี่ยน
  }, [productCart, totalPrice]);
  return (
    <div> {/* เปลี่ยนพื้นหลังคอนเทนต์หลัก */}
      {/* Navbar ส่วนบน */}
      <div className="p-1 mb-2 text-dark" style={{ backgroundColor: '#C40C0C' }}>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            {/* แถบค้นหา */}
            <form className="d-flex flex-grow-1">
              <input className="form-control me-2" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }} type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-light" type="submit"><i className="bi bi-search"></i></button>
            </form>
            <div className="text-end">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active text-light" to={`/cart/${cartId}`}>฿ {totalPrice}</Link>
                  </li>
                  <li className="nav-item">
                    <i className="bi bi-basket3 fs-3 text-light"></i>
                  </li>
                  <i className="bi bi-dash-lg fs-3 text-black d-none d-lg-inline" style={{ transform: 'rotate(90deg)' }}></i>
                  {/* ปุ่ม Profile พร้อม dropdown เมนู */}
                  <li className="nav-item dropdown ms-auto d-flex align-items-center position-relative">
                    <button className="btn d-flex align-items-center caret-off" 
                      id="profileDropdown" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                      style={{
                        border: '1.5px solid #000',
                        padding: '5px 10px',
                        borderRadius: '10px',
                        backgroundColor: 'transparent',
                        color: '#FFFFFF',
                        position: 'relative' // กำหนดให้ปุ่มมีตำแหน่งที่เป็นฐาน
                      }}
                    >
                      <img
                        src="https://example.com/profile.jpg"  // URL ของรูปโปรไฟล์
                        alt="Profile"
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          marginRight: '8px'
                        }}
                      />
                      <span>ชื่อโปรไฟล์</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" 
                      aria-labelledby="profileDropdown"
                      style={{
                        position: 'absolute', // ทำให้ dropdown เมนูเป็นตำแหน่งที่กำหนดเอง
                        top: '65%', // อยู่ใต้ปุ่มพอดี
                        left: '0',
                        zIndex: '1000' // ให้ dropdown อยู่ด้านบน
                      }}>
                      <li><Link className="dropdown-item" to="/profile">โปรไฟล์ของฉัน</Link></li>
                      <li><Link className="dropdown-item" to="/settings">การตั้งค่า</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button type='botton' className="dropdown-item btn" onClick={(e) => handleLogout()}>ออกจากระบบ</button></li>
                    </ul>
                  </li>
                  {/* <li className="nav-item">
                    <Link className="nav-link active text-light" aria-current="page" to="/signup">สมัครสมาชิก</Link>
                  </li> */}
                  {/* <li className="nav-item">
                    <Link className="nav-link active text-light" to="#">฿ 0.00</Link>
                  </li> */}
                  {/* <li className="nav-item">
                    <i className="bi bi-basket3 fs-3 text-light"></i>
                  </li> */}

                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Navbar ส่วนล่าง */}
      <div className="container text-center my-4">
        <img
          src="https://example.com/logo.png" // เปลี่ยน URL เป็นโลโก้ของคุณ
          alt="Bakery Cookie New Happy Family"
          style={{ width: '150px' }}
        />
        <nav className="container text-center col-5 mt-3 border rounded-pill p-1 border-dark" style={{ backgroundColor: '#C40C0C' }}>
          <Link className="btn btn-outline text-white rounded-pill mx-1" to="/home">หน้าหลัก</Link>

          {/* Dropdown menu สำหรับหมวดหมู่ */}
          <div className="dropdown d-inline">
          <button type="button" className="btn btn-outline text-white rounded-pill mx-1 " data-bs-toggle="dropdown" aria-expanded="false" >หมวดหมู่</button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
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
    </div>
  );
}

export default Navbar
