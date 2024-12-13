import React, { useState } from 'react';

const ErrorPopup = ({onClose, handleConfirm, message, text }) => {
  const errorMessage = message.response.data.message
  const [showModal , setShowModal] = useState(true)

  return (
    <div className={`modal fade ${showModal ? "show" : ""}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-labelledby="cancelOrderModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className='text-danger'>{text}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button> {/* ปุ่มปิด */}
          </div>
          <div className="modal-body">
            {/*value ข้อมูลที่จะส่งไป*/}
            <p>{errorMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
