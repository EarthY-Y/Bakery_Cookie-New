import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ErrorPopup = ({ onClose, handleConfirm, message, title }) => {
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
    if (onClose) onClose();
  };

  const handleConfirmation = () => {
    setShowModal(false);
    if (handleConfirm) handleConfirm();
  };

  return (
    <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
      aria-labelledby="errorModalLabel" aria-hidden="true" >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-warning">
          <div className="modal-header text-black" style={{backgroundColor: '#FDDE55' }} >
            <h5 className="modal-title" id="errorModalLabel">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {title || 'เเจ้งเตือนข้อผิดพลาด'}
            </h5>
            <button type="button" className="btn-close btn-close-black" onClick={handleClose} aria-label="Close" ></button>
          </div>
          <div className="modal-body text-center">
            <h5 className="text-black fs-5">{message || 'มีบางอย่างผิดพลาด กรุณารีหน้าเว็บใหม่.'}</h5>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
            {handleConfirm && (
              <button type="button" className="btn btn-warning" onClick={handleConfirmation}>
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
