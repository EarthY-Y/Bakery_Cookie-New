import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getlistOrdersWaitPayment, getlistOrdersprocess, getStatusListForCancelOrdersService, cancelOrder, getOrderslistByIdService } from '../../../../API/customer/orderTrackingService';
import { formatDate } from '../../../untils/frommatters/datetime';
import { numberGrouping } from '../../../untils/frommatters/numberFormatting';
import { copyToClipboard } from '../../../untils/fucntion/copyToClipboard';
import CancelOrderModal from '../../../untils/popUp/canclePopUp';
import LoadingPopup from '../../../untils/popUp/loading';
import ErrorPopup from '../../../untils/popUp/errorPopup';
import { AlertWithProgressBar } from '../../../untils/fucntion/alert';

const OrderTracking = () => {
  const [orderWaitStatement, setOrdersWaitStatement] = useState([]);
  const [showButtonCancel, setShowButtonCancel] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const [
          getOrderslistById,
          getStatusListForCancelOrders
        ] = await Promise.all([
          getOrderslistByIdService(id),
          getStatusListForCancelOrdersService(),
        ]);

        // ตั้งค่าข้อมูลคำสั่งซื้อ
        console.log("Orders Wait Payment:", getOrderslistById.data);
        console.log("getStatusListForCancelOrders:", getStatusListForCancelOrders.data);

        setOrdersWaitStatement(getOrderslistById.data);
        setShowButtonCancel(getStatusListForCancelOrders.data)
      } catch (err) {
        console.error("Error fetching orders data:", err);
        setError(err)
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  // คำนวณข้อมูลที่จะแสดงในแต่ละหน้า
  const indexOfLastItem = currentPage * itemsPerPage; //sum 10
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; //sum 0
  const currentOrders = orderWaitStatement.slice(indexOfFirstItem, indexOfLastItem);//slice เลือกข้อมูลที่อยู่ระหว่าง 2 ตัวนี้คือ 0,10 

  const totalPages = Math.ceil(orderWaitStatement.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCancelOrder = async (reason) => {
    cancelOrder(orderId, reason)
      .then(() => {
        setOrdersWaitStatement(prevOrdersCheckOut => prevOrdersCheckOut.filter(OrdersCheck => OrdersCheck.orders_id !== orderId))
      })
      .catch(err => console.log(err))
  }

  const handleCopy = async (orders_id) => {
    const result = await copyToClipboard(orders_id);
    setShowAlert(result); // จะแสดงข้อความที่ได้จาก copyToClipboard
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>รายการสั่งซื้อ</h4>
      </div>
      <h4>{id}</h4>
      {currentOrders.map((order) => {
        const isCancelable = showButtonCancel.some((status) => status.status_name === order.status_name);
        return (
          <div key={order.orders_id} className="col-md-12 mb-4" /* ใช้ Bootstrap Grid */>
            <div className="card border-secondary">
              <div className="card-header">
                <span>รหัสคำสั่งซื้อ: {order.orders_id}<button className="btn bi bi-copy" onClick={() => handleCopy(order.orders_id)}></button></span>
                <span className="badge bg-warning text-dark">{order.status_name}</span>
              </div>
              <div className="card-body">
                <p className="card-text">ปริมาณ: {order.quantity} ชิ้น</p>
                <p className="card-text">ราคารวม: {numberGrouping(order.price)} บาท</p>
                <p className="card-text">วันที่สั่งซื้อ: {formatDate(order.created_at)}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                {order.status_name === "รอการชำระเงิน" ? (
                  <Link to={`/payment/${order.cartId}`} className="btn btn-primary">ชำระเงิน</Link>
                ) : isCancelable ? (
                  <div className=" d-flex justify-content-between">
                    <button className="btn btn-danger" onClick={() => { setShowCancelModal(true); setOrderId(order.orders_id); }}>ยกเลิกคำสั่งซื้อ</button>
                  </div>
                ) : ("")}
                <div className=" d-flex justify-content-end">
                  <Link to={`view/detail/${order.orders_id}`} className="btn btn-secondary ">  รายละเอียด</Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}

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
      <CancelOrderModal
        showModal={showCancelModal}
        handleClose={() => setShowCancelModal(false)}
        handleCancelOrder={handleCancelOrder} //handleCancelOrder เก็บข้อมูล input ไว้อยู่
      />
      {showCancelModal ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
      <LoadingPopup
        isLoading={isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
      {showAlert !== null && (
        <AlertWithProgressBar
          message={showAlert ? "คัดลอกสำเร็จ" : "คัดลอกไม่สำเร็จ"}
          duration={3000}
          onClose={() => setShowAlert(null)} // ปิด alert เมื่อปิด
          status={showAlert ? 'bg-success' : 'bg-danger'} // ใช้ bg-success หรือ bg-danger ตาม showAlert
        />
      )}
      {error && (
        <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default OrderTracking;
