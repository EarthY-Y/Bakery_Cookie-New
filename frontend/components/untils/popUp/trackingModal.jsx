import React, { useState } from 'react';
import { formatDate } from '../../untils/frommatters/datetime';

const TrackingModal = ({ showModal, handleCloseModal, tracking }) => {
  const [cancelReason, setCancelReason] = useState("");
  //เมื่อกดปุ่มจะทำงานตามคำสั่งที่หน้านั้นๆเอาไปใช้ คือเป็นการเอา function หรือ ตัวเเปรจากหน้าที่นำมาใช้เข้ามาใช้ในตัวมัน
  const handleSubmit = () => {
    setCancelReason(""); // รีเซ็ตข้อความ
    handleCloseModal(); // ปิด modal
  };

  return (
    <div className={`modal fade ${showModal ? "show" : ""}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-labelledby="cancelOrderModalLabel" aria-hidden="true">
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">รายละเอียดสถานะ</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
            {tracking ? (
              <div className='card'>
                <div className="card-body">
                  <div className="timeline ">
                    {tracking.slice().reverse().map((item, index) => (
                      <div className="mb-2" key={index}>
                        <div className="d-flex align-items-start">
                          <div className="ms-3">
                            <h6 className="fw-bold">
                              {tracking.length - index}) {item.status_description} -{" "} <span className="text-muted">{item.location}</span>
                            </h6>
                            <h5 className="mb-1 text-muted small">{item.status_date} ({item.postcode})</h5>
                            <h5 className="mb-0">{item.status_detail}</h5>
                            {item.delivery_description && (
                              <h5 className="text-danger small mb-0">หมายเหตุ: {item.delivery_description}</h5>
                            )}
                            {/* {item.receiver_name && (<h5 className="text-success small">ผู้รับ: {item.receiver_name}</h5>)} */}
                            {/* {item.signature && (<img src={item.signature}alt="ลายเซ็น"style={{ width: "100px", marginTop: "10px" }}/>)} */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) :("")}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}> ปิด </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingModal;
