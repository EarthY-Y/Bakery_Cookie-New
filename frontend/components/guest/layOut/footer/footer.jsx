import React, { useState, useEffect }  from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCategoryService } from "../../../../API/guest/guestProductService"
const Footer = () => {
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [         
          getCategory,
        ] = await Promise.all([
          getCategoryService(),
        ])
        setCategoryList(getCategory.data)
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);
  return (
    <footer className="text-white py-5 d-flex align-items-end flex-column" style={{ backgroundColor: '#C40C0C'}}>
      <div className="container col-12 text-start mt-auto p-2 ">
        <h5>About</h5>
        <p>ร้านโฮมเมดเบเกอร์รี่แอนด์คุกกี้ เป็นร้านขายขนมที่ผลิตสดใหม่ทุกวัน</p>
        <h5>Contact</h5>
        <p>Tel: 089 xxx xxxx<br />Facebook: <br />Line: </p>
      </div>
      <div className="container-fluid text-white d-block d-md-none" style={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 1030, backgroundColor: '#C40C0C' }}>
        <div className="row text-center py-2">
          <div className="col">
            <div className="dropdown dropup d-inline">
              <button type="button" className="btn btn-outline text-white rounded-pill" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontWeight: "500", marginTop: "-5px" }} data-bs-placement="top">
                <i className="bi bi-grid-3x3-gap fs-3"></i>
                <p className="small m-0">หมวดหมู่</p>
              </button>
              <ul className="dropdown-menu mb-4" aria-labelledby="dropdownMenuButton" style={{ position: "absolute", bottom: "100%", left: "0" }}>
                {categoryList.map((item, index)=>(
                  <li key={index}><Link className="dropdown-item" to={`/list/category/product/`+ item.category_name} onClick={location.reload}>{item.category_name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          {/* ติดต่อเรา */}
          <div className="col">
            <Link className="text-white text-decoration-none" to="/signup">
              <i className="bi bi-clipboard-plus-fill fs-3"></i>
              <p className="small mb-0" style={{ fontWeight: "500" }}>สมัครสมาชิก</p>
            </Link>
          </div>
          {/* โปรไฟล์ */}
          <div className="col">
            <Link className="text-white text-decoration-none" to="/login">
              <i className="bi bi-door-open-fill fs-3"></i>
              <p className="small mb-0" style={{ fontWeight: "500" }}>เข้าสู่ระบบ</p>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;