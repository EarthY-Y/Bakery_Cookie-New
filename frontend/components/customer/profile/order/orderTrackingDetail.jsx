import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { orderDetailById, orderHistoryById, orderProductById, cancelOrder, getStatusListForCancelOrdersService, orderTrackingAddressService } from '../../../../API/customer/orderTrackingService';
import { formatDate } from '../../../untils/frommatters/datetime';
import { numberGrouping } from '../../../untils/frommatters/numberFormatting';
import { copyToClipboard } from '../../../untils/fucntion/copyToClipboard';
import { goBackOrHome } from '../../../untils/fucntion/backFuction';
import CancelOrderModal from '../../../untils/popUp/canclePopUp';
import LoadingPopup from '../../../untils/popUp/loading';
import ErrorPopup from '../../../untils/popUp/errorPopup';
import {AlertWithProgressBar} from '../../../untils/fucntion/alert';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const OrderTracking = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [ordersDetail, setOrdersDetail] = useState([]);
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [ordersProduct, setOrdersProduct] = useState([]);
  const [address, setAddress] = useState([]) 
  const [showBtnPay, setShowBtnPay] = useState(false); 
  const [showCanCel, setShowCanCel] = useState(true); 
  const [showStep ,setShowStep] = useState(true); 
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(null);
  const [error, setError] = useState(null);
  const [postCode, setPostCode] = useState("");

  // สถานะที่ต้องการแสดงบน Progress Bar
  const statusSteps = [
    { name: "ชำระเงินเรียบร้อย", icon: "bi bi-cash" },
    { name: "รับออร์เดอร์เเเล้ว", icon: "bi bi-check-circle" },
    { name: "กำลังแพ็คสินค้า", icon: "bi bi-box" },
    { name: "จัดส่งสำเร็จ", icon: "bi bi-truck" },
  ];
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const [
          detailResponse, 
          historyResponse, 
          productResponse, 
          orderAddress,
          getStatusListForCancelOrders,
        ] = await Promise.all([
          orderDetailById(id),
          orderHistoryById(id),
          orderProductById(id),
          orderTrackingAddressService(id),
          getStatusListForCancelOrdersService(),
        ]);
  
        // ตั้งค่าข้อมูลคำสั่งซื้อ
        console.log("Order Details:", detailResponse.data);
        console.log("Order History:", historyResponse.data);
        console.log("Order Products:", productResponse.data);
        console.log("Order Address:", orderAddress.data);
        console.log("getStatusListForCancelOrders:", getStatusListForCancelOrders.data);
  
        // จัดการข้อมูลที่ดึงมา
        const detailData = detailResponse.data[0];
        setOrdersDetail(detailData);
        if (detailData?.status === "รอการชำระเงิน") setShowBtnPay(true);
        if (detailData?.status === "จัดส่งสำเร็จ") setShowCanCel(false);
        if (detailData?.status === "ยกเลิก") {
          setShowCanCel(false);
          setShowStep(false);
        }
        const isCancelable = getStatusListForCancelOrders.data.some((status) => status.status_name === detailData.status);
        setShowCanCel(isCancelable)
        setPostCode(detailResponse.data[0]?.post_code || "")

        const historyData = historyResponse.data;
        setOrdersHistory(historyData);
        if (historyData.length === 0) setShowBtnPay(true);
  
        const productData = productResponse.data;
        setOrdersProduct(productData);

        setAddress(orderAddress.data[0])
      } catch (err) {
        console.error("Error fetching orders data:", err);
        setError(err)
      }finally{
        setIsLoading(false);
      }
    };
  
    fetchOrders();
  }, [id]);
  

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

  const handleCancelOrder = async(reason) => {
    console.log("เหตุผลในการยกเลิก:", reason, id);
    const response = await cancelOrder(id, reason)
    if(response){
      setShowCancelModal(false)
      navigate(-1)
    }
  };

  const handleCopy = async (copyText) => {
    const result = await copyToClipboard(copyText);
    setShowAlert(result); // แสดง Alert หากคัดลอกสำเร็จ result ที่ส่งมาจาก copyToClipboard จะเป็น true กับ false
  };

  return (
    <div className="container mt-1  mb-5">
      <button className="btn btn-light text-dark mb-4" onClick={() => {goBackOrHome(navigate)}}> {/*ไม่ต้องใส่ () เพราะมันจะถูกทำงานทุกครั้งที่ component render*/}
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </button>
      <div className='align-items-center row mb-4'>
        <div className='col-12 col-lg-6'>
          <h3>สถานะคำสั่งซื้อ</h3>
        </div>
        <div className='col-12 col-lg-6 text-lg-end'>
          <span ><b>รหัสคำสั่งซื้อ:</b> {ordersDetail.orders_id}<button className="btn bi bi-copy" onClick={() => handleCopy(ordersDetail.orders_id)}></button></span>
        </div>
        <div className='col-12 col-lg-8 mb-2 text-start'>
          <span ><b>ปลายทาง:</b> {address.house_no} ตำบล {address.tambon_name} อำเภอ {address.amphure_name} จังหวัด {address.province_name} {address.zip_code}</span>
        </div>
        {postCode && (
          <div className='col-12 col-lg-4 mb-2 text-lg-end'>
            <span ><b>รหัสไปรษณีย์:</b> {postCode}<button className="btn bi bi-copy" onClick={() => handleCopy(postCode)}></button></span>
          </div>
        )}
      </div>

      <div className="card">
        <div className={`card-body ${showStep ? 'd-block' : 'd-none'}`}>
          <div className={`progress-container d-flex justify-content-between align-items-center `} >
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
        <div className={`card-body ${showStep ? 'd-none' : 'd-block'} bg-danger bg-opacity-10 pb-0`}>
            <div className={`text-danger d-flex justify-content-between align-items-center`} >
                <h3>{ordersDetail.status}</h3>
                <p>{formatDate(ordersDetail.updated_at)}</p>
            </div>
            <div className="text-danger">
                <p>เหตุผลในการยกเลิก: {ordersDetail.note}</p>
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
            <div className="card-header d-flex justify-content-between align-items-center">
              <p className="mb-0"><strong>ชื่อสินค้า:</strong> {order.product_name}</p>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-2">
                  <img src={`${API_URL_PICTURE}/${order.productpic_name}`} alt="Product" className="img-fluid" />
                </div>
                <div className="col-md-3 col-6">
                  <p className="mb-0"><strong>ปริมาณ:</strong> {order.productCartQuantity} ชิ้น</p>
                </div>
                <div className="col-md-3 col-6 text-end">
                  <p className="mb-0"><strong>ชิ้นละ:</strong> {order.productCartPrice} บาท</p>
                </div>
                <div className="col-md-4 col-12 text-end">
                  <p className="mb-0"><strong>รวมเป็น:</strong> {numberGrouping(order.productCartPrice * order.productCartQuantity)} บาท</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="card-footer text-end d-flex justify-content-end">
          <div className='text-start me-2'>
            <h5 className="mb-0 text-danger">ราคารวมสินค้า </h5> 
            <h5 className="mb-0 text-danger">ค่าส่ง </h5> 
            <h5 className="mb-0 text-danger">ค่ากล่อง </h5>
            <h5 className="mb-0 text-danger">ยอดชำระ </h5>
          </div>
          <div className='text-start'>
            <h5 className="mb-0 text-danger">: {numberGrouping(ordersDetail.price || 0)} บาท</h5>
            <h5 className="mb-0 text-danger">: {numberGrouping(ordersDetail.cost_shipping || 0)} บาท</h5>
            <h5 className="mb-0 text-danger">: {numberGrouping(ordersDetail.cost_package || 0)} บาท</h5>
            <h5 className="mb-0 text-danger">: {numberGrouping(ordersDetail.price + ordersDetail.cost_package + ordersDetail.cost_shipping  || 0)} บาท</h5>
          </div>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between mt-4">
        <button className="btn btn-danger" onClick={() => setShowCancelModal(true)} style={{ display: showCanCel ? 'block' : 'none' }}> ยกเลิกคำสั่งซื้อ</button> 
        <Link  to={`/payment/${ordersDetail.cartId}`}  className="btn btn-primary" style={{ display: showBtnPay ? 'block' : 'none' }}> ชำระเงิน</Link>
      </div>
      <CancelOrderModal
        showModal={showCancelModal}
        handleClose={() => setShowCancelModal(false)}
        handleCancelOrder={handleCancelOrder} //handleCancelOrder เก็บข้อมูล input ไว้อยู่
      />
      {showCancelModal ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
      <LoadingPopup
        isLoading = {isLoading}
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
