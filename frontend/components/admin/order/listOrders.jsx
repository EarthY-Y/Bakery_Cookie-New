import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOrderWaitStatementService, listOrderCheckOutService } from '../../../API/admin/ordersService';
import { formatDate } from '../../untils/frommatters/datetime';

const ListOrders = () => {
  const [orderWaitStatement, setOrdersWaitStatement] = useState([]);
  const [orderCheckOut, setOrdersCheckOut] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCheckOut, setCurrentPageCheckOut] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await listOrderWaitStatementService();
        console.log(res.data);
        setOrdersWaitStatement(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await listOrderCheckOutService();
        console.log(res.data);
        setOrdersCheckOut(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getOrders();
  }, []);


  // คำนวณข้อมูลที่จะแสดงในแต่ละหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orderWaitStatement.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(orderWaitStatement.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItemCheckOut = currentPageCheckOut * itemsPerPage;
  const indexOfFirstItemCheckOut = indexOfLastItemCheckOut - itemsPerPage;
  const currentOrdersCheckOut = orderCheckOut.slice(indexOfFirstItemCheckOut, indexOfLastItemCheckOut);

  const totalPagesCheckOut = Math.ceil(orderCheckOut.length / itemsPerPage);

  const handlePageChangeCheckOut = (pageNumber) => {
    setCurrentPageCheckOut(pageNumber);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>รายการสั่งซื้อ</h2>
      </div>
      <h4>รอการชำระเงิน</h4>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th className="text-center align-middle" style={{ width: '25%' }}>รหัสคำสั่งซื้อ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ปริมาณ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ราคารวม</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่สั่งซื้อ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่ชำระเงิน</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>สถานะ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>รายละเอียด</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.orders_id}>
              <td>{order.orders_id}</td>
              <td>{order.quantity} ชิ้น</td>
              <td>{order.price} บาท</td>
              <td>{formatDate(order.created_at)}</td>
              <td>{formatDate(order.updated_at) || `รอชำระเงิน`}</td>
              <td className="text-center">{order.status_name}</td>
              <td className="text-center">
                <Link to={`view/detail/order/${order.orders_id}`} className="btn btn-outline-warning text-black">View</Link>
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
      <h4>พร้อมดำเนินการ</h4>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th className="text-center align-middle" style={{ width: '25%' }}>รหัสคำสั่งซื้อ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ปริมาณ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ราคารวม</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่สั่งซื้อ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่ชำระเงิน</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>สถานะ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>รายละเอียด</th>
          </tr>
        </thead>
        <tbody>
          {currentOrdersCheckOut.map((order) => (
            <tr key={order.orders_id}>
              <td>{order.orders_id}</td>
              <td>{order.quantity} ชิ้น</td>
              <td>{order.price} บาท</td>
              <td>{formatDate(order.created_at)}</td>
              <td>{formatDate(order.updated_at) || `รอชำระเงิน`}</td>
              <td className="text-center">{order.status_name}</td>
              <td className="text-center">
                <Link to={`view/detail/order/${order.orders_id}`} className="btn btn-outline-warning text-black">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination justify-content-end"> 
          <li className={`page-item ${currentPageCheckOut === 1 ? 'disabled' : ''}`}> {/* หน้าเเรก */}
            <button className="page-link" onClick={() => handlePageChangeCheckOut(1)}>First</button> 
          </li>
          <li className={`page-item ${currentPageCheckOut === 1 ? 'disabled' : ''}`}> {/*หน้าก่อนหน้านี้*/}
            <button className="page-link" onClick={() => handlePageChangeCheckOut(currentPageCheckOut - 1)}>Previous</button>
          </li>
          {[...Array(totalPagesCheckOut)].map((_, index) => ( //หน้าปัจุบันเเละหน้าทั้งหมดที่มี
            <li key={index + 1} className={`page-item ${index + 1 === currentPageCheckOut ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChangeCheckOut(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPageCheckOut === totalPagesCheckOut ? 'disabled' : ''}`}> {/*หน้าต่อไป*/}
            <button className="page-link" onClick={() => handlePageChangeCheckOut(currentPageCheckOut + 1)}>Next</button>
          </li>
          <li className={`page-item ${currentPageCheckOut === totalPagesCheckOut ? 'disabled' : ''}`}> {/*หน้าสุดท้าย */}
            <button className="page-link" onClick={() => handlePageChangeCheckOut(totalPagesCheckOut)}>Last</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ListOrders;
