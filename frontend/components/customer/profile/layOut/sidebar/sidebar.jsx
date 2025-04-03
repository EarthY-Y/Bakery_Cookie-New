import React, { useEffect, useState,useRef } from 'react';
import { Link } from 'react-router-dom';
import { getStatusOrderslistService } from '../../../../../API/customer/orderTrackingService';
import ErrorPopup from '../../../../untils/popUp/errorPopup';
import LoadingPopup from '../../../../untils/popUp/loading';

function Sidebar() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listStatusOrders, setListStatusOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // อ้างอิง Dropdown
  const history = ["ยกเลิก", "จัดส่งสำเร็จ"]
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          getStatusOrderslist,
        ] = await Promise.all([
          getStatusOrderslistService(),
        ]);
        console.log(getStatusOrderslist.data);

        setListStatusOrders(getStatusOrderslist.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ตรวจจับการคลิกนอก Dropdown เพื่อปิด
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="d-flex justify-content-center mt-3 me-2">
      {/* หน้าจอใหญ่ */}
      <div className="card border-0 shadow-sm d-none d-lg-block" style={{ width: "300px", borderRadius: "8px" }}>
        <div className="card-body">
          <nav className="nav flex-column navbar-expand-lg">
            <Link className="nav-link text-dark" to="/profile">บัญชีของฉัน</Link>
            <Link className="nav-link text-dark" to="/profile/customer/address">ข้อมูลที่อยู่</Link>
            {/* Dropdown ติดตามคำสั่งซื้อ */}
            <div className="dropdown w-100">
              <button className="btn btn-light dropdown-toggle w-100 text-start" onClick={() => setDropdownOpen(!dropdownOpen)}>ติดตามคำสั่งซื้อ</button>
              {dropdownOpen && (
                <ul className="dropdown-menu w-100 border shadow-sm mt-1 mb-2 overflow-auto position-static" style={{ maxHeight: "100%" }}>
                  {listStatusOrders.length > 0 ? (
                    listStatusOrders.map((status, index) => (
                      <li key={index}>
                        {history.includes(status.status_name) ? (
                          <Link className="dropdown-item" to={`/profile/orderHistory/${status.status_name}`}>{status.status_name}  ({status.countOrders})</Link>
                        ) : (
                          <Link className="dropdown-item" to={`/profile/orderTracking/${status.status_name}`}>{status.status_name}  ({status.countOrders})</Link>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="dropdown-item text-muted">ไม่มีข้อมูล</li>
                  )}
                </ul>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* หน้าจอเล็ก */}
      <div className="border-0 d-block d-lg-none mb-3 mt-3" style={{ width: '100%' }} >
        <div className="row text-center">
          <Link className="text-dark text-decoration-none col-4" to="/profile">
            <i className="bi bi-person-circle fs-4"></i>
            <p className="small">บัญชี</p>
          </Link>
          <Link className="text-dark text-decoration-none col-4" to="/profile/customer/address">
            <i className="bi bi-geo-alt fs-4"></i>
            <p className="small">ที่อยู่</p>
          </Link>

          {/* ติดตามคำสั่งซื้อ (Dropdown Responsive) */}
          <div className="col-4 position-relative dropdown"
            tabIndex={0} // ทำให้ element นี้ focus ได้ (จำเป็นสำหรับ onBlur)
            onBlur={() => setDropdownOpen(false)} // ปิด dropdown เมื่อ focus หายไป
          >
            {/* ปุ่มกดเปิด Dropdown */}
            <button className="btn btn-link text-dark text-decoration-none p-0 dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)} aria-expanded={dropdownOpen}>
              <i className="bi bi-truck fs-4"></i>
              <p className="small">คำสั่งซื้อ</p>
            </button>
            <div className={`dropdown-menu border rounded shadow-sm p-2 text-start ${dropdownOpen ? "show" : ""}`} 
             style={{left: "50%",transform: "translateX(-70%)",maxWidth: "90vw",overflow: "auto",maxHeight: "300px",whiteSpace: "nowrap",}}>
              <p className="fw-bold text-center mb-2">สถานะคำสั่งซื้อ</p>
              <ul className="list-unstyled mb-0">
                {listStatusOrders.length > 0 ? (
                  listStatusOrders.map((status, index) => (
                    <li key={index}>
                      {history.includes(status.status_name) ? (
                        <Link className="dropdown-item small py-1 d-block text-truncate"
                          to={`/profile/orderHistory/${status.status_name}`}>
                          {status.status_name} ({status.countOrders})
                        </Link>
                      ) : (
                        <Link className="dropdown-item small py-1 d-block text-truncate"
                          to={`/profile/orderTracking/${status.status_name}`}>
                          {status.status_name} ({status.countOrders})
                        </Link>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item text-muted small py-1">ไม่มีข้อมูล</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <LoadingPopup isLoading={isLoading} />
      {isLoading && <div className="modal-backdrop fade show"></div>}
      {error && <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />}
    </div>
  );
}

export default Sidebar;
