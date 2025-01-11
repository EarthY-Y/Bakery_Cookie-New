import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStatusOrderService, getStatusCartService } from '../../../../API/admin/ordersService';
import { formatDate } from '../../../untils/frommatters/datetime';

const ListOrders = () => {
  const [statusCart, setStatusCart] = useState([]);
  const [currentPageCart, setCurrentPageCart] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await getStatusCartService();
        console.log(res.data);
        setStatusCart(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getOrders();
  }, []);

  const indexOfLastItemCart = currentPageCart * itemsPerPage;
  const indexOfFirstItemCart = indexOfLastItemCart - itemsPerPage;
  const currentStatusCart = statusCart.slice(indexOfFirstItemCart, indexOfLastItemCart);

  const totalPagesCheckOut = Math.ceil(statusCart.length / itemsPerPage);

  const handlePageChangeCheckOut = (pageNumber) => {
    setCurrentPageCart(pageNumber);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>สถานะ</h2>
        <Link to="create" className="btn btn-success d-none d-md-inline-block"><i className="bi bi-plus-circle-fill"></i> เพิ่มสถานะ </Link>
        <Link to="create" className="btn btn-success btn-sm d-md-none"><i className="bi bi-plus-circle-fill"></i> เพิ่มสถานะ </Link>
      </div>
      <p>ตะกร้าสินค้า</p>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '20%' }}>รหัสสถานะ</th>
              <th style={{ width: '10%' }}>ชื่อสถานะ</th>
              <th style={{ width: '15%' }}>วันที่สร้าง</th>
              <th style={{ width: '15%' }}>วันที่เเก้ไข</th>
              <th style={{ width: '10%' }}>สร้างโดย</th>
              <th style={{ width: '10%' }}>เเก้ไขโดย</th>
              <th style={{ width: '10%' }}>สถานะการใช้งาน</th>
              <th style={{ width: '15%' }}>เเก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {currentStatusCart.map((order) => (
              <tr key={order.status_cart_id}>
                <td>{order.status_cart_id}</td>
                <td>{order.status_name}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>{formatDate(order.updated_at) || ""}</td>
                <td className="text-center">{order.created_by}</td>
                <td className="text-center">{order.updated_by}</td>
                {order.is_active === 1 ? <td className="text-center text-success">ใช้งาน</td> : <td className="text-center text-danger">ไม่ใช่งาน</td>}
                <td className="text-center">
                  <Link to={`edit/cart/${order.status_cart_id}`} className="btn btn-warning"><i className="bi bi-pencil"></i></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-3">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {currentStatusCart.map((order) => (
              <div className="col-12 border rounded p-3 shadow-sm bg-light" key={order.status_cart_id}>
                <div className="small text-secondary">
                  <p className="mb-1">รหัสสถานะ: {order.status_cart_id}</p>
                  <p className="mb-1">ชื่อสถานะ: {order.status_name}</p>
                  <p className="mb-1">วันที่สั่งซื้อ: {formatDate(order.created_at)}</p>
                  <p className="mb-1">วันที่ชำระเงิน: {formatDate(order.updated_at) || ""}</p>
                  <p className="mb-1">สร้างโดย: {order.created_by}</p>
                  <p className="mb-1">เเก้ไขโดย: {order.updated_by}</p>
                  {order.is_active === 1 ? <p className="mb-1 text-success">ใช้งาน</p> : <p className="mb-1 text-danger">ไม่ใช้งาน</p>}
                </div>
                <div className="d-flex flex-row-reverse bd-highlight mt-3">
                  <Link to={`edit/cart/${order.status_cart_id}`} className="btn btn-warning btn-sm"><i className="bi bi-pencil"></i> แก้ไข </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav>
        <ul className="pagination justify-content-end"> 
          <li className={`page-item ${currentPageCart === 1 ? 'disabled' : ''}`}> {/* หน้าเเรก */}
            <button className="page-link" onClick={() => handlePageChangeCheckOut(1)}>First</button> 
          </li>
          <li className={`page-item ${currentPageCart === 1 ? 'disabled' : ''}`}> {/*หน้าก่อนหน้านี้*/}
            <button className="page-link" onClick={() => handlePageChangeCheckOut(currentPageCart - 1)}>Previous</button>
          </li>
          {[...Array(totalPagesCheckOut)].map((_, index) => ( //หน้าปัจุบันเเละหน้าทั้งหมดที่มี
            <li key={index + 1} className={`page-item ${index + 1 === currentPageCart ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChangeCheckOut(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPageCart === totalPagesCheckOut ? 'disabled' : ''}`}> {/*หน้าต่อไป*/}
            <button className="page-link" onClick={() => handlePageChangeCheckOut(currentPageCart + 1)}>Next</button>
          </li>
          <li className={`page-item ${currentPageCart === totalPagesCheckOut ? 'disabled' : ''}`}> {/*หน้าสุดท้าย */}
            <button className="page-link" onClick={() => handlePageChangeCheckOut(totalPagesCheckOut)}>Last</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ListOrders;
