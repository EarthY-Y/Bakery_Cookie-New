import React, { useState } from 'react';

const CancelOrderModal = ({ showModal, handleClose, handleCancelOrder }) => {
  const [cancelReason, setCancelReason] = useState("");
  //เมื่อกดปุ่มจะทำงานตามคำสั่งที่หน้านั้นๆเอาไปใช้ คือเป็นการเอา function หรือ ตัวเเปรจากหน้าที่นำมาใช้เข้ามาใช้ในตัวมัน
  const handleSubmit = () => {
    handleCancelOrder(cancelReason); // ส่งเหตุผลไปยัง parent
    setCancelReason(""); // รีเซ็ตข้อความ
    handleClose(); // ปิด modal
  };

  return (
    <div className={`modal fade ${showModal ? "show" : ""}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-labelledby="cancelOrderModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="cancelOrderModalLabel">เหตุผลในการยกเลิกคำสั่งซื้อ</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            {/*value ข้อมูลที่จะส่งไป*/}
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}placeholder="ระบุเหตุผลในการยกเลิกคำสั่งซื้อ..."rows="4"className="form-control mb-3" required/>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>ยกเลิก</button>
            <button type="button" className="btn btn-danger" onClick={handleSubmit}>ยืนยันการยกเลิก</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
