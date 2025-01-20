import React, { useState } from 'react';
import { formatDate } from '../../untils/frommatters/datetime';

const DetailStatusModal = ({ showModal, handleCloseModal, ordersHistory }) => {
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
              {ordersHistory.map((step, index) => (
                <div key={index} className="progress-step text-center mb-3">
                  <div className="progress-label">{step.status_name}</div>
                  <div className="progress-label">{formatDate(step.change_time)}</div>
                </div>
              ))}
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

export default DetailStatusModal;
