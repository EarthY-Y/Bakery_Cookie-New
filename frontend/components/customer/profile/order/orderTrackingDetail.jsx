import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { orderDetailById,orderHistoryById,orderProductById } from '../../../../API/customer/orderTrackingService';
import { formatDate } from '../../../untils/frommatters/datetime';
import { numberGrouping } from '../../../untils/frommatters/numberFormatting';
import { goBackOrHome } from '../../../untils/fucntion/backFuction';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const OrderTracking = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [ordersDetail, setOrdersDetail] = useState([]);
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [ordersProduct, setOrdersProduct] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); 
  const [showBtnPay, setShowBtnPay] = useState(false); 
  // สถานะที่ต้องการแสดงบน Progress Bar
  const statusSteps = [
    { name: "ชำระเงินเรียบร้อย", icon: "bi bi-cash" },
    { name: "รับออร์เดอร์เเเล้ว", icon: "bi bi-check-circle" },
    { name: "กำลังแพ็คสินค้า", icon: "bi bi-box" },
    { name: "จัดส่งสำเร็จ", icon: "bi bi-truck" },
  ];
  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await orderDetailById(id);
        console.log(res.data);
        setOrdersDetail(res.data[0]);
        res.data[0]?.status === "รอการชำระเงิน" ? setShowBtnPay(true) : ""; 
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await orderHistoryById(id);
        console.log(res.data);
        setOrdersHistory(res.data);
        res.data.length === 0 ? setShowBtnPay(true) : "";
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await orderProductById(id);
        console.log(res.data);
        setOrdersProduct(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getOrders();
  }, []);

  const isCompleted = (stepName) => {
    return ordersHistory.some((status) => status.status_name === stepName);
  };

  // ฟังก์ชันหาสถานะปัจจุบัน (ล่าสุด)
  const getCurrentStep = () => {
    for (let i = statusSteps.length - 1; i >= 0; i--) {
      if (isCompleted(statusSteps[i])) {
        return statusSteps[i];
      }
    }
    return null;
  };
  const currentStep = getCurrentStep();
  return (
    <div className="container mt-2">
      <button className="btn btn-light text-dark mb-4" onClick={() => {goBackOrHome(navigate)}}> {/*ไม่ต้องใส่ () เพราะมันจะถูกทำงานทุกครั้งที่ component render*/}
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </button>
      <div className='d-flex justify-content-between align-items-center'>
        <div>
          <h3 className="mb-4">สถานะคำสั่งซื้อ</h3>
        </div>
        <div>
          <span >รหัสคำสั่งซื้อ: {ordersDetail.orders_id}</span>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="progress-container d-flex justify-content-between align-items-center">
            {statusSteps.map((step, index) => (
              <div key={index} className="progress-step text-center">
                <div
                  className={`progress-icon ${
                    isCompleted(step.name) ? "completed" : step.name === currentStep ? "current" : ""
                  }`}
                >
                  <i className={step.icon}></i>
                </div>
                <div className="progress-label">{step.name}</div>
                {isCompleted(step.name) && (
                  <div className="progress-time">
                    {formatDate(
                      ordersHistory.find((status) => status.status_name === step.name)?.change_time
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS สำหรับ Progress Bar */}
      <style jsx="true">{`
        .progress-container {
          display: flex;
          position: relative;
        }
        .progress-step {
          flex: 1;
        }
        .progress-icon {
          width: 50px;
          height: 50px;
          border: 2px solid #6c757d;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #6c757d;
          margin: 0 auto;
        }
        .progress-icon.completed {
          background-color: #28a745;
          border-color: #28a745;
          color: white;
        }
        .progress-icon.current {
          background-color: #ffc107;
          border-color: #ffc107;
          color: white;
        }
        .progress-label {
          margin-top: 8px;
          font-size: 0.9rem;
        }
        .progress-time {
          font-size: 0.8rem;
          color: #6c757d;
        }
      `}</style>
      <div className="card mt-5">
        {ordersProduct.map((order) => (
          <div key={order.product_name} className="col-md-12">
            <div className="border-secondary">
              <div className="card-header d-flex justify-content-between align-items-center">
                <p className="mb-0"><strong>ชื่อสินค้า:</strong> {order.product_name}</p>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img src={`${API_URL_PICTURE}/${order.productpic_name}`} alt="Product" className="img-fluid" />
                  </div>
                  <div className="col-md-6">
                    <p className="mb-0"><strong>ปริมาณ:</strong> {order.productCartQuantity} ชิ้น</p>
                  </div>
                  <div className="col-md-4 text-end">
                    <p className="mb-0"><strong>ราคารวม:</strong> {numberGrouping(order.productCartPrice*order.productCartQuantity)} บาท</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="card-footer d-flex justify-content-end">
          <p className="mb-0"><strong>ราคารวม:</strong> {numberGrouping(ordersDetail.price || 0)} บาท</p>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <Link  to={`/payment/${ordersDetail.cartId}`}  className="btn btn-primary" style={{ display: showBtnPay ? 'block' : 'none' }}> ชำระเงิน</Link>
      </div>
    </div>
  );
};

export default OrderTracking;
