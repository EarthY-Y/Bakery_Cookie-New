import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { getCategoryService } from "../../../../API/customer/productService"
import ErrorPopup from '../../../untils/popUp/errorPopup';

const Footer = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [error, setError] = useState(null);

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
        setError(error)
      }
    };
    fetchData();
  }, []);
  return (
    <footer className="text-white py-5 d-flex align-items-end flex-column ">
      <div className="container col-12 text-start mt-auto p-2 d-none d-lg-block">
        <h5>เกี่ยวกับร้าน</h5>
        <p>Bakery Cookie&New ร้านเบเกอรี่เล็กๆ ใจกลางรามอินทรา 101 โดดเด่นด้วยขนมอบสดใหม่ที่ทำตามออร์เดอร์ทุกชิ้น ไม่ว่าจะเป็นเค้ก ขนมปัง หรือคุกกี้ รับประกันความสดใหม่และรสชาติที่ใส่ใจในทุกขั้นตอน 
          พร้อมเสิร์ฟความอร่อยให้กับทุกโอกาสพิเศษของคุณ!</p>
        <h5>Contact</h5>
        <p>Tel: 0891175751 <br />Line official account: @421qvgwl</p>
      </div>

      <div className="container-fluid text-white d-block d-lg-none" style={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 1030, backgroundColor: '#C40C0C' }}>
        <div className="row text-center py-2">
          {/* หมวดหมู่ */}
          <div className="col">
            <div className="dropdown dropup d-inline">
              <button type="button" className="btn btn-outline text-white rounded-pill" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontWeight: "500", marginTop: "-5px" }} data-bs-placement="top">
                <i className="bi bi-grid-3x3-gap fs-3"></i>
                <p className="small m-0">หมวดหมู่</p>
              </button>
              {categoryList.length !== 0 ? (
                  <><ul className="dropdown-menu mt-2 mb-4" aria-labelledby="dropdownMenuButton1">
                    {categoryList.map((item, index)=>(
                      <li key={index}><Link className="dropdown-item" to={`/category/`+ item.category_name}>{item.category_name}</Link></li>
                    ))}
                    </ul>
                  </>
                ) : ("")}
            </div>
          </div>
          {/* ติดต่อเรา */}
          <div className="col">
            <Link className="text-white text-decoration-none" to="/contact">
              <i className="bi bi-chat-dots fs-3"></i>
              <p className="small mb-0" style={{ fontWeight: "500" }}>ติดต่อเรา</p>
            </Link>
          </div>
          {/* โปรไฟล์ */}
          <div className="col">
            <Link className="text-white text-decoration-none" to="/profile">
              <i className="bi bi-person-circle fs-3"></i>
              <p className="small mb-0" style={{ fontWeight: "500" }}>โปรไฟล์</p>
            </Link>
          </div>
        </div>
      </div>
      {error && (
        <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
      )}
    </footer>
  );
};

export default Footer;