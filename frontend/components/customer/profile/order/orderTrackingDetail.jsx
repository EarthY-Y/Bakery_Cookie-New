import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { orderDetailById, orderHistoryById, orderProductById, cancelOrder, getStatusListForCancelOrdersService,
   orderTrackingAddressService, getTracking } from '../../../../API/customer/orderTrackingService';
import { formatDate,formatDateThai } from '../../../untils/frommatters/datetime';
import { numberGrouping } from '../../../untils/frommatters/numberFormatting';
import { copyToClipboard } from '../../../untils/fucntion/copyToClipboard';
import CancelOrderModal from '../../../untils/popUp/canclePopUp';
import LoadingPopup from '../../../untils/popUp/loading';
import ErrorPopup from '../../../untils/popUp/errorPopup';
import { AlertWithProgressBar } from '../../../untils/fucntion/alert';
import DetailStatusModal from '../../../untils/popUp/detailStatusModal';
import TrackingModal from '../../../untils/popUp/trackingModal';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const OrderTracking = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ordersDetail, setOrdersDetail] = useState([]);
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [ordersProduct, setOrdersProduct] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [address, setAddress] = useState([])
  const [showBtnPay, setShowBtnPay] = useState(false);
  const [showCanCel, setShowCanCel] = useState(true);
  const [showStep, setShowStep] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(null);
  const [error, setError] = useState(null);
  const [postCode, setPostCode] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [latestStatus, setLatestStatus] = useState([]);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  // สถานะที่ต้องการแสดงบน Progress Bar
  const statusSteps = [
    { name: "ชำระเงินเรียบร้อย", icon: "bi bi-cash" },
    { name: "รับออร์เดอร์แล้ว", icon: "bi bi-check-circle" },
    { name: "อยู่ในระหว่างการทำ", icon: "bi bi-box" },
    { name: "อยู่ระหว่างการจัดส่ง", icon: "bi bi-truck" },
    { name: "จัดส่งสำเร็จ", icon: "bi bi-check-circle" },
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
        if (detailData?.status === "ยกเลิก") {
          setShowStep(false);
        }
        const isCancelable = getStatusListForCancelOrders.data.some((status) => status.status_name === detailData.status);
        setShowCanCel(isCancelable)
        setPostCode(detailResponse.data[0]?.post_code || "")
        const historyData = historyResponse.data;
        setOrdersHistory(historyData);
        setLatestStatus(historyResponse.data[0] || [])
        if (historyData.length === 0) setShowBtnPay(true);

        const productData = productResponse.data;
        setOrdersProduct(productData);

        setAddress(orderAddress.data[0])
      } catch (err) {
        console.error("Error fetching orders data:", err);
        setError(err)
      }
    };

    fetchOrders();
  }, [id]);

  //เอาไปไว้รวมกับ fetchOrders ไม่ได้เพราะว่าต้องรอข้อมูจาก setPostCode ก่อน
  useEffect(() => {
    const trackingData = async () => {
      if (postCode) {
        try {
          const trackingData = await getTracking(postCode); // รอข้อมูลจาก API
          console.log("trackingData:", trackingData.response.items[postCode]); // ดูข้อมูลใน console
          setTracking(trackingData.response.items[postCode]); // ตั้งค่า state ด้วยข้อมูลที่ได้
        } catch (error) {
          console.error("Error fetching tracking data:", error); // จัดการกับ error
        }finally { 
          //เพราะการเรียกใช้งาน API ของไปรษณีย์เสร็จที่หลัง ถึงเราจะใช้ useState เก็บ true/false เพื่อเอาไปมันก็ย้อนกลับไปทำ finally ของ fetchOrders ก็ไม่ทันเพราะมันเสร็จก่อนเเละก็ไม่สน t/f ยังไงก็ต้อง setIsLoading(false);
          setIsLoading(false);
        }
      }else {
        setIsLoading(false);
      }
    };

    trackingData();
  }, [postCode])

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

  const handleCancelOrder = async (reason) => {
    console.log("เหตุผลในการยกเลิก:", reason, id);
    const response = await cancelOrder(id, reason)
    if (response) {
      setShowCancelModal(false)
      navigate(-1)
    }
  };

  const handleCopy = async (copyText) => {
    const result = await copyToClipboard(copyText);
    setShowAlert(result); // แสดง Alert หากคัดลอกสำเร็จ result ที่ส่งมาจาก copyToClipboard จะเป็น true กับ false
  };

  const handleShowModal = () => setShowDetailModal(true);
  const handleCloseModal = () => setShowDetailModal(false);

  const handleShowTrackingModal = () => setShowTrackingModal(true);
  const handleCloseTrackingModal = () => setShowTrackingModal(false);

  return (
    <div className="container">
      <div className='align-items-center row mb-4'>
        <div className='col-12 col-lg-6'>
          <h4>สถานะคำสั่งซื้อ</h4>
        </div>
        <div className='col-12 col-lg-6 text-lg-end'>
          <span ><b>รหัสคำสั่งซื้อ:</b> {ordersDetail.orders_id}<button className="btn bi bi-copy" onClick={() => handleCopy(ordersDetail.orders_id)}></button></span>
        </div>
      </div>

      <div className="card">
        <div className={`card-body ${showStep ? 'd-block' : 'd-none'}`}>
          <div className="d-none d-lg-block">
            <div className={`progress-container d-flex align-items-center `} >
              {statusSteps.map((step, index) => (
                <div key={index} className="progress-step text-center">
                  <div className={`progress-icon ${isCompleted(step.name) ? "completed" : step.name === currentStep ? "current" : ""}`}>
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
          <div className="d-block d-lg-none">
            <div className="progress-container d-flex flex-column align-items-center row">
              {/* สถานะล่าสุด */}
              <div className="progress-step text-center col-6">
                {/* <div className={`progress-icon ${latestStatus ? "current" : "completed"  }`}>
                  <i className={statusSteps.find((step) => step.name === currentStep)?.icon}></i>
                </div> */}
                <div className="progress-label">{latestStatus.status_name || "รอชำระเงิน"}</div>
                <div className="progress-time">
                  {latestStatus.change_time ? (formatDate(latestStatus.change_time)) : ("")}
                </div>
              </div>
              <button className="btn btn-primary mt-3 col-6" onClick={handleShowModal}>  ดูรายละเอียด</button>
              {showDetailModal && (
                <DetailStatusModal
                  showModal={handleShowModal}
                  handleCloseModal={() => handleCloseModal()}
                  ordersHistory={ordersHistory}
                />
              )}
            </div>
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

      <div className='align-items-center row mb-2 mt-3'>
        <div className='col-12 col-lg-8 mb-2 text-start'>
          <span ><b>ปลายทาง:</b> {address.house_no} ตำบล {address.tambon_name} อำเภอ {address.amphure_name} จังหวัด {address.province_name} {address.zip_code}</span>
        </div>
        {postCode && (
          <div className='col-12 col-lg-4 mb-2 text-lg-end'>
            <span ><b>รหัสไปรษณีย์:</b> {postCode}<button className="btn bi bi-copy" onClick={() => handleCopy(postCode)}></button></span>
          </div>
        )}
      </div>
      {tracking ? (
        tracking.length !== 0 ? (
            <>
              <h5 className="modal-title mb-2">รายละเอียดสถานะ</h5>
              <div className='card shadow-sm'>
                <div className="card-body">
                  <div className="ms-3">
                    <div className='row'>
                      <div className='col-12 col-lg-6'>
                        <h6 className="fw-bold ">
                          {tracking[tracking.length - 1].status_description} -{" "} <span className="text-muted">{tracking[tracking.length - 1].location}</span>
                        </h6>
                        <p className="mb-0 text-muted small">{formatDateThai(tracking[tracking.length - 1].status_date)} ({tracking[tracking.length - 1].postcode})</p>
                        <p className="mb-0">{tracking[tracking.length - 1].status_detail}</p>
                        {tracking[tracking.length - 1].delivery_description && (
                          <p className="text-danger small">หมายเหตุ: {tracking[tracking.length - 1].delivery_description}</p>
                        )}
                        {/* {item.receiver_name && (<p className="text-success small">ผู้รับ: {item.receiver_name}</p>)} */}
                        {/* {item.signature && (<img src={item.signature}alt="ลายเซ็น"style={{ width: "100px", marginTop: "10px" }}/>)} */}
                      </div>
                      <div className='col-12 col-lg-6 d-flex justify-content-end align-items-center '>
                        <button className="btn btn-primary col-6" style={{ height: "50px" }} onClick={handleShowTrackingModal}>ดูรายละเอียด</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : ("")
      ) : ("")}
      {showTrackingModal && (
        <TrackingModal
          showModal={handleShowTrackingModal}
          handleCloseModal={() => handleCloseTrackingModal()}
          tracking={tracking}
        />
      )}
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
            <h5 className="mb-0 text-danger">: {numberGrouping(ordersDetail.price + ordersDetail.cost_package + ordersDetail.cost_shipping || 0)} บาท</h5>
          </div>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between mt-4">
        <button className="btn btn-danger" onClick={() => setShowCancelModal(true)} style={{ display: showCanCel ? 'block' : 'none' }}> ยกเลิกคำสั่งซื้อ</button>
        <Link to={`/payment/${ordersDetail.cartId}`} className="btn btn-primary" style={{ display: showBtnPay ? 'block' : 'none' }}> ชำระเงิน</Link>
      </div>
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
