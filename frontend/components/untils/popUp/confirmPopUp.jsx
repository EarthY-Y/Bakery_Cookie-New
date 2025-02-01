import React, { useState } from 'react';

const ConfirmPopUpModal = ({ showModal, handleClose, handleConfirm, title, text }) => {

  const handleSubmit = () => {
    handleConfirm(); // ส่งเหตุผลไปยัง parent
    handleClose(); // ปิด modal
  };

  return (
    <div className={`modal fade ${showModal ? "show" : ""}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-labelledby="cancelOrderModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="cancelOrderModalLabel">{title}</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            {/*value ข้อมูลที่จะส่งไป*/}
            <h5 className='text-danger'><b>{text}</b></h5>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>ยกเลิก</button>
            <button type="button" className="btn btn-danger" onClick={handleSubmit}>ยืนยัน</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopUpModal;
