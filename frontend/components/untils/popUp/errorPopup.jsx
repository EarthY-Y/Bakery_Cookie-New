import React, { useState } from 'react';

const ErrorPopup = ({ onClose, handleConfirm, message, text }) => {
  const errorMessage = message?.response?.data?.message || message || 'มีบางอย่างผิดพลาดกรุณา รีหน้าเว็บใหม่';
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
        <div className="modal-content border-danger">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title" id="errorModalLabel"><i className="bi bi-exclamation-circle-fill me-2"></i>{text || 'เเจ้งเตือนข้อผิดพลาด'}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body text-center">
            <p className="text-danger fs-5">{errorMessage}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
              {handleConfirm && (
                <button type="button" className="btn btn-danger" onClick={handleConfirmation}>Confirm</button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
