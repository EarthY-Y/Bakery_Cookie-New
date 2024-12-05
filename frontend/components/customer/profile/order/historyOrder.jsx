import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getlistOrdersCancel, getlistOrdersFinish, cancelOrder } from '../../../../API/customer/orderTrackingService';
import { formatDate } from '../../../untils/frommatters/datetime';
import { numberGrouping } from '../../../untils/frommatters/numberFormatting';
import CancelOrderModal from '../../../untils/popUp/canclePopUp';

const OrderTracking = () => {
  const [orderWaitStatement, setOrdersWaitStatement] = useState([]);
  const [orderCheckOut, setOrdersCheckOut] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCheckOut, setCurrentPageCheckOut] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await getlistOrdersCancel();
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
        const res = await getlistOrdersFinish();
        console.log(res.data);
        setOrdersCheckOut(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getOrders();
  }, []);

  // คำนวณข้อมูลที่จะแสดงในแต่ละหน้า
  const indexOfLastItem = currentPage * itemsPerPage; //sum 10
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; //sum 0
  const currentOrders = orderWaitStatement.slice(indexOfFirstItem, indexOfLastItem);//slice เลือกข้อมูลที่อยู่ระหว่าง 2 ตัวนี้คือ 0,10 

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

  const handleCancelOrder = async(reason) => {
    console.log("เหตุผลในการยกเลิก:", reason, orderId);
    const response = await cancelOrder(orderId, reason)
    if(response){
      setShowCancelModal(false)
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>รายการสั่งซื้อ</h2>
      </div>
      <h4>ยกเลิกคำสั่งซื้อ</h4>
        {currentOrders.map((order) => (
          <div key={order.orders_id} className="col-md-12 mb-4" /* ใช้ Bootstrap Grid */>
            <div className="card border-secondary">
              <div className="card-header d-flex justify-content-between">
                <span>รหัสคำสั่งซื้อ: {order.orders_id}</span>
                <span className="badge bg-danger text-white">{order.status_name}</span>
              </div>
              <div className="card-body">
                <p className="card-text">ปริมาณ: {order.quantity} ชิ้น</p>
                <p className="card-text">ราคารวม: {numberGrouping(order.price)} บาท</p>
                <p className="card-text">วันที่สั่งซื้อ: {formatDate(order.created_at)}</p>
                <p className="card-text" style={{ display: order.note ? 'block' : 'none' }}>เหตุผลในการยกเลิก: {order.note}</p>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <Link  to={`view/detail/${order.orders_id}`}  className="btn btn-secondary ">  รายละเอียด</Link>
              </div>
            </div>
          </div>
        ))}

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
      <h4>สั่งซื้อสำเร็จ</h4>
      {currentOrdersCheckOut.map((order) => (
          <div key={order.orders_id} className="col-md-12 mb-4" /* ใช้ Bootstrap Grid */>
            <div className="card border-secondary">
              <div className="card-header d-flex justify-content-between">
                <span>รหัสคำสั่งซื้อ: {order.orders_id}</span>
                <span className="badge bg-success text-white">{order.status_name}</span>
              </div>
              <div className="card-body">
                <p className="card-text">ปริมาณ: {order.quantity} ชิ้น</p>
                <p className="card-text">ราคารวม: {numberGrouping(order.price)} บาท</p>
                <p className="card-text">วันที่สั่งซื้อ: {formatDate(order.created_at)}</p>
                <p className="card-text">วันที่ชำระเงิน: {formatDate(order.updated_at)}</p>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <Link  to={`view/detail/${order.orders_id}`}  className="btn btn-secondary">  รายละเอียด</Link>
              </div>
            </div>
          </div>
        ))}

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
      <CancelOrderModal
        showModal={showCancelModal}
        handleClose={() => setShowCancelModal(false)}
        handleCancelOrder={handleCancelOrder} //handleCancelOrder เก็บข้อมูล input ไว้อยู่
      />
      {showCancelModal ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default OrderTracking;
