import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOrderSuccessService, listOrderHistoryCancelService } from '../../../../API/admin/ordersHistoryService';
import { formatDate } from '../../../untils/frommatters/datetime';

const listHistory = () => {
  const [orderWaitStatement, setOrdersWaitStatement] = useState([]);
  const [orderCheckOut, setOrdersCheckOut] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCheckOut, setCurrentPageCheckOut] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await listOrderSuccessService();
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
        const res = await listOrderHistoryCancelService();
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
        <h2>ประวัติการสั่งซื้อ</h2>
      </div>
      <h4>จัดส่งสำเร็จ</h4>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '25%' }}>รหัสคำสั่งซื้อ</th>
              <th style={{ width: '10%' }}>ปริมาณ</th>
              <th style={{ width: '10%' }}>ราคารวม</th>
              <th style={{ width: '10%' }}>วันที่สั่งซื้อ</th>
              <th style={{ width: '10%' }}>วันที่ชำระเงิน</th>
              <th style={{ width: '10%' }}>สถานะ</th>
              <th style={{ width: '10%' }}>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.orders_id}>
                <td>{order.orders_id}</td>
                <td>{order.quantity} ชิ้น</td>
                <td>{order.price} บาท</td>
                <td>{formatDate(order.created_at)}</td>
                <td className="text-center">{`รอชำระเงิน`}</td>
                <td className="text-center">{order.status_name}</td>
                <td className="text-center">
                  <Link to={`view/detail/order/${order.orders_id}`} className="btn btn-info text-light"><i className="bi bi-eye"></i></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-3">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {currentOrders.map((order) => (
              <div className="col-12 border rounded p-3 shadow-sm bg-light" key={order.orders_id}>
                <div className="small text-secondary">
                  <p className="mb-1">รหัสคำสั่งซื้อ: {order.orders_id}</p>
                  <p className="mb-1">ปริมาณ: {order.quantity} ชิ้น</p>
                  <p className="mb-1">ราคารวม: {order.price} บาท</p>
                  <p className="mb-1">วันที่สั่งซื้อ: {formatDate(order.created_at)}</p>
                  <p className="mb-1">วันที่ชำระเงิน: {`รอชำระเงิน`}</p>
                  <p className="mb-1">สถานะ: {order.status_name}</p>
                </div>
                <div className="d-flex flex-row-reverse bd-highlight mt-2">
                  <Link to={`view/detail/order/${order.orders_id}`} className="btn btn-info text-light btn-sm"><i className="bi bi-eye"></i> ดู </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
      <h4>ยกเลิก</h4>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '25%' }}>รหัสคำสั่งซื้อ</th>
              <th style={{ width: '10%' }}>ปริมาณ</th>
              <th style={{ width: '10%' }}>ราคารวม</th>
              <th style={{ width: '10%' }}>วันที่สั่งซื้อ</th>
              <th style={{ width: '10%' }}>วันที่ชำระเงิน</th>
              <th style={{ width: '10%' }}>สถานะ</th>
              <th style={{ width: '10%' }}>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {currentOrdersCheckOut.map((order) => (
              <tr key={order.orders_id}>
                <td>{order.orders_id}</td>
                <td>{order.quantity} ชิ้น</td>
                <td>{order.price} บาท</td>
                <td>{formatDate(order.created_at)}</td>
                <td className="text-center">{formatDate(order.updated_at) || `รอชำระเงิน`}</td>
                <td className="text-center">{order.status_name}</td>
                <td className="text-center">
                  <Link to={`view/detail/order/${order.orders_id}`} className="btn btn-info text-light"><i className="bi bi-eye"></i></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-3">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {currentOrdersCheckOut.map((order) => (
              <div className="col-12 border rounded p-3 shadow-sm bg-light" key={order.orders_id}>
                <div className="small text-secondary">
                  <p className="mb-1">รหัสคำสั่งซื้อ: {order.orders_id}</p>
                  <p className="mb-1">ปริมาณ: {order.quantity} ชิ้น</p>
                  <p className="mb-1">ราคารวม: {order.price} บาท</p>
                  <p className="mb-1">วันที่สั่งซื้อ: {formatDate(order.created_at)}</p>
                  <p className="mb-1">วันที่ชำระเงิน: {formatDate(order.updated_at) || `รอชำระเงิน`}</p>
                  <p className="mb-1">สถานะ: {order.status_name}</p>
                </div>
                <div className="d-flex flex-row-reverse bd-highlight mt-2">
                  <Link to={`view/detail/order/${order.orders_id}`} className="btn btn-info text-light btn-sm"><i className="bi bi-eye"></i> ดู </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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

export default listHistory;
