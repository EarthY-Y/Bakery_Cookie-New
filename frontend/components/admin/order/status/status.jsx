import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStatusOrderService, getStatusCartService } from '../../../../API/admin/ordersService';
import { formatDate } from '../../../untils/frommatters//datetime';

const ListOrders = () => {
  const [statusOrders, setStatusOrders] = useState([]);
  const [statusCart, setStatusCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCart, setCurrentPageCart] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await getStatusOrderService();
        console.log(res.data);
        setStatusOrders(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getOrders();
  }, []);

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


  // คำนวณข้อมูลที่จะแสดงในแต่ละหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStatusOrders = statusOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(statusOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        <h2>รายการสั่งซื้อ</h2>
        <Link to="create" className="btn btn-outline-warning text-black">
          เพิ่มวัตถุดิบ
        </Link>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th className="text-center align-middle" style={{ width: '15%' }}>รหัสสถานะ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ชื่อสถานะ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่สร้าง</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่เเก้ไข</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>สร้างโดย</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>เเก้ไขโดย</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>เเก้ไข</th>
          </tr>
        </thead>
        <tbody>
          {currentStatusOrders.map((order) => (
            <tr key={order.status_order_id}>
              <td>{order.status_order_id}</td>
              <td>{order.status_name}</td>
              <td>{formatDate(order.created_at)}</td>
              <td>{formatDate(order.updated_at) || `รอชำระเงิน`}</td>
              <td className="text-center">{order.create_by}</td>
              <td>{order.update_by}</td>
              <td className="text-center">
                <Link to={`edit/order/${order.status_order_id}`} className="btn btn-outline-warning text-black">edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination justify-content-end"> 
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}> {/* หน้าเเรก */}
            <button className="page-link" onClick={() => handlePageChange(1)}>First</button> 
          </li>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}> {/*หน้าก่อนหน้านี้*/}
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
          </li>
          {[...Array(totalPages)].map((_, index) => ( //หน้าปัจุบันเเละหน้าทั้งหมดที่มี
            <li key={index + 1} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}> {/*หน้าต่อไป*/}
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}> {/*หน้าสุดท้าย */}
            <button className="page-link" onClick={() => handlePageChange(totalPages)}>Last</button>
          </li>
        </ul>
      </nav>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th className="text-center align-middle" style={{ width: '15%' }}>รหัสสถานะ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ชื่อสถานะ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่สั่งซื้อ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่ชำระเงิน</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>สร้างโดย</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>เเก้ไขโดย</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>เเก้ไข</th>
          </tr>
        </thead>
        <tbody>
          {currentStatusCart.map((order) => (
            <tr key={order.status_cart_id}>
              <td>{order.status_cart_id}</td>
              <td>{order.status_name}</td>
              <td>{formatDate(order.created_at)}</td>
              <td>{formatDate(order.updated_at) || `รอชำระเงิน`}</td>
              <td>{order.create_by}</td>
              <td className="text-center">{order.update_by}</td>
              <td className="text-center">
                <Link to={`edit/cart/${order.status_cart_id}`} className="btn btn-outline-warning text-black">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
